import requests
import dotenv
from flask import Flask, request, jsonify
import os
from datetime import datetime
from dotenv import load_dotenv
import json
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS, cross_origin
import traceback


load_dotenv()

apiKey = os.getenv('CARSXE_API_KEY')
openai_api_key = os.getenv('OPENAI_API_KEY')
print(f"API Key exists: {'Yes' if openai_api_key else 'No'}")

# Get the directory where the script is located
current_dir = os.path.dirname(os.path.abspath(__file__))

# Create the path to the credentials file
cred_path = os.path.join(current_dir, "fb-admin-sdk.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def format_date(date_str):
    if not date_str:
        return ""
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.000Z")
        return dt.strftime("%B %d, %Y")
    except:
        return date_str

def format_car_report(data):
    formatted_data = {
        "vin": data.get('vin', 'N/A'),
        "junk_and_salvage": [],
        "insurance_info": [],
        "brand_info": []
    }
    
    # Junk and Salvage Information
    if data.get('junkAndSalvageInformation'):
        for item in data['junkAndSalvageInformation']:
            entity = item.get('ReportingEntityAbstract', {})
            if entity:
                salvage_record = {
                    "reporting_entity": entity.get('EntityName', 'N/A'),
                    "location": f"{entity.get('LocationCityName', '')}, {entity.get('LocationStateUSPostalServiceCode', '')}".strip(', '),
                    "date_obtained": format_date(item.get('VehicleObtainedDate', '')),
                    "disposition": item.get('VehicleDispositionText', 'N/A')
                }
                formatted_data["junk_and_salvage"].append(salvage_record)

    # Insurance Information
    if data.get('insuranceInformation'):
        for item in data['insuranceInformation']:
            entity = item.get('ReportingEntityAbstract', {})
            if entity:
                insurance_record = {
                    "company": entity.get('EntityName', 'N/A'),
                    "location": f"{entity.get('LocationCityName', '')}, {entity.get('LocationStateUSPostalServiceCode', '')}".strip(', '),
                    "date": format_date(item.get('VehicleObtainedDate', '')),
                    "disposition": item.get('VehicleDispositionText', 'N/A')
                }
                formatted_data["insurance_info"].append(insurance_record)

    # Brand Information - Only if brandsRecordCount >= 1
    if data.get('brandsInformation'):
        print("===============================")
        print(data.get("brandsInformation"))
        brand_records = [brand for brand in data['brandsInformation'] if 'record' in brand]
        if brand_records:  # Only add brand section if we have records
            formatted_data["brand_info"] = []
            for brand in brand_records:
                brand_record = {
                    "name": brand.get('name', 'N/A'),
                    "code": brand.get('code', 'N/A'),
                    "description": brand.get('description', 'N/A'),
                    "date": format_date(brand['record'].get('VehicleBrandDate', {}).get('Date', '')),
                    "reporting_entity": brand['record'].get('ReportingEntityAbstract', {}).get('EntityName', 'N/A'),
                    "state": brand['record'].get('ReportingEntityAbstract', {}).get('IdentificationID', 'N/A'),
                    "disposition": brand['record'].get('VehicleDispositionText', 'N/A')
                }
                formatted_data["brand_info"].append(brand_record)

    return formatted_data


#API for user car query
@app.route("/user_car_query", methods=['POST'])
@cross_origin()
def get_user_car_query():

    # Get parameters from request
    make = request.json.get('make')
    model = request.json.get('model')
    year = request.json.get('year')
    query = request.json.get('query')
    
    # Validate required parameters 
    if not all([make, model, year, query]):
        return jsonify({
            'error': 'Missing required parameters. Please provide make, model, year, and query.'
        }), 400
    
    try:
        # Construct the prompt
        prompt = f"I have a {year} {make} {model}. {query}"
        
        # Setup OpenAI API request
        headers = {
            'Authorization': f'Bearer {openai_api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'model': 'gpt-3.5-turbo',
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are an automotive expert assistant. Provide accurate and helpful information about specific car makes, models, and years.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.7
        }
        
        # Make request to OpenAI
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=data
        )
        
        # Check if request was successful
        if response.status_code == 200:
            response_data = response.json()
            answer = response_data['choices'][0]['message']['content']
            return jsonify({
                'question': query,
                'car': f"{year} {make} {model}",
                'answer': answer
            })
        else:
            print(f"OpenAI API Error: {response.status_code}")
            print(f"Response: {response.text}")
            return jsonify({
                'error': 'Failed to get response from OpenAI'
            }), response.status_code
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'error': 'An error occurred processing your request'
        }), 500
    
    #API for Car Market Value Information

@app.route("/api/car_marketvalue", methods=['GET'])
def get_car_marketvalue():
    vin = request.args.get('vin')
    
    if not vin:
        return jsonify({'error': 'VIN parameter is required'}), 400
    
    params = {
        'key': apiKey,
        'vin': vin
    }
    try:
        response = requests.get('https://api.carsxe.com/marketvalue', params=params)
        
        if response.status_code == 200:
            data = response.json()
            return jsonify(data)
        else:
            error_msg = f'API request failed with status code {response.status_code}'
            return jsonify({'error': error_msg}), response.status_code
    except Exception as e:
        error_msg = f'Error processing request: {str(e)}'
        return jsonify({'error': error_msg}), 500
        
#API for Car History Information
@app.route('/api/carinfo', methods=['GET'])
def get_car_info():
    vin = request.args.get('vin')
    
    if not vin:
        return jsonify({'error': 'VIN parameter is required'}), 400
    
    try:
        # Read data directly from rawjson.txt file
        with open('server/rawjson.txt', 'r') as file:
            data = json.loads(file.read())
        formatted_data = format_car_report(data)
        
        # Print to console for debugging
        print("\nAPI Response for VIN:", vin)
        print(json.dumps(formatted_data, indent=2))
        
        return jsonify(formatted_data)
            
    except Exception as e:
        error_msg = f'Error processing request: {str(e)}'
        print("\nError:", error_msg)
        return jsonify({'error': error_msg}), 500


@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    print("=== Login Request ===")
    print(f"Request Method: {request.method}")
    print(f"Request Headers: {dict(request.headers)}")
    print(f"Request Body: {request.get_data(as_text=True)}")
    
    try:
        print("Parsing request data...")
        user_data = request.json
        if not user_data:
            print("No JSON data received")
            return jsonify({'error': 'No data received'}), 400
            
        print(f"User data received: {json.dumps(user_data, indent=2)}")
        
        if not user_data.get('uid') or not user_data.get('email'):
            print("Error: Invalid user data - missing uid or email")
            return jsonify({'error': 'Invalid user data - missing uid or email'}), 400
        
        # Add debug logging for Firestore operations
        print(f"Attempting to access Firestore - db object type: {type(db)}")
        
        # Use email as document ID instead of UID
        user_ref = db.collection('users').document(user_data['email'])
        print(f"Created document reference for email: {user_data['email']}")
        
        user_doc = user_ref.get()
        print(f"Retrieved document snapshot - exists: {user_doc.exists}")
        
        if not user_doc.exists:
            print(f"Creating new user document with data:")
            user_data_to_save = {
                'first_name': user_data.get('first_name', ''),
                'last_name': user_data.get('last_name', ''),
                'email': user_data['email'],
                'photo_url': user_data.get('photo_url', ''),
                'uid': user_data['uid'],
                'created_at': firestore.SERVER_TIMESTAMP
            }
            # Print the data without the SERVER_TIMESTAMP
            print({k: v for k, v in user_data_to_save.items() if k != 'created_at'})
            
            try:
                user_ref.set(user_data_to_save)
                print("Document creation successful")
            except Exception as e:
                print(f"Document creation failed with error: {str(e)}")
                raise
                
            return jsonify({'message': 'User created successfully'}), 201
        
        print(f"User already exists - Email: {user_data['email']}")
        return jsonify({'message': 'User already exists'}), 200
        
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {str(e)}")
        return jsonify({'error': 'Invalid JSON data'}), 400
    except Exception as e:
        print(f"Login error: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error traceback: {traceback.format_exc()}")
        return jsonify({'error': f'An error occurred during login: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)