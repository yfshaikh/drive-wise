import requests
import dotenv
from flask import Flask, request, jsonify
import os
from datetime import datetime
from dotenv import load_dotenv
import json


load_dotenv()

apiKey = os.getenv('CARSXE_API_KEY')
openai_api_key = os.getenv('OPENAI_API_KEY')
print(f"API Key exists: {'Yes' if openai_api_key else 'No'}")

app = Flask(__name__)
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
@app.route("/api/user_car_query", methods=['GET'])
def get_user_car_query():
    # Get parameters from request
    make = request.args.get('make')
    model = request.args.get('model')
    year = request.args.get('year')
    query = request.args.get('query')
    
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
@app.route('/api/car-info', methods=['GET'])
def get_car_info():
    vin = request.args.get('vin')
    
    if not vin:
        return jsonify({'error': 'VIN parameter is required'}), 400
    
    params = {
        'key': apiKey,
        'vin': vin
    }
    
    try:
        response = requests.get('https://api.carsxe.com/history', params=params)
        
        if response.status_code == 200:
            data = response.json()
            formatted_data = format_car_report(data)
            
            # Print to console for debugging
            print("\nAPI Response for VIN:", vin)
            print(json.dumps(formatted_data, indent=2))
            
            return jsonify(formatted_data)
        else:
            error_msg = f'API request failed with status code {response.status_code}'
            print("\nError:", error_msg)
            return jsonify({'error': error_msg}), response.status_code
            
    except Exception as e:
        error_msg = f'Error processing request: {str(e)}'
        print("\nError:", error_msg)
        return jsonify({'error': error_msg}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)