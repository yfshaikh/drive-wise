import requests, json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os
from dotenv import load_dotenv
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup

load_dotenv()

# Get the directory where the script is located
current_dir = os.path.dirname(os.path.abspath(__file__))

# Create the path to the credentials file
cred_path = os.path.join(current_dir, "fb-admin-sdk.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Loop through years 2015-2020
for year in range(2015, 2021):
    url = f'https://carapi.app/api/models?sort=name&verbose=yes&year={year}&make=toyota'
    r = requests.get(url)
    data = r.json()

    # Filter out objects with name "hidden" or starting with "*"
    filtered_data = [item for item in data['data'] if not item['name'].startswith('*')]
    
    # Save each car model to Firestore
    for car in filtered_data:
        # Create a unique document ID using year and car name
        doc_id = f"{year}_{car['name'].replace(' ', '_').lower()}"
        
        # Add year field to the car data
        car['year'] = year
        
        # Save to Firestore
        db.collection('cars').document(doc_id).set(car)
        print(f"Saved {year} {car['name']} to Firestore")

# Add images to existing car documents
cars_ref = db.collection('cars')
cars = cars_ref.stream()

# Initialize WebDriver once outside the loop
driver = webdriver.Chrome()
driver.implicitly_wait(10)

for car in cars:
    car_data = car.to_dict()
    year = car_data['year']
    model = car_data['name'].lower().replace(' ', '-')
    
    try:
        # Construct URL for each car
        url = f"https://www.cars.com/research/toyota-{model}-{year}/"
        print(f"Scraping images for: {url}")
        
        # Load the page
        driver.get(url)
        
        # Get the full rendered page source
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, "html.parser")
        
        # Find the div with the class "research-hero-gallery-modal-content"
        gallery_div = soup.find("div", class_="research-hero-gallery-modal-content")
        
        # Initialize an empty dictionary to store image sources
        image_dict = {}
        
        # Find all img tags within the div and get their src attributes
        if gallery_div:
            images = gallery_div.find_all("img")
            for index, img in enumerate(images):
                src = img.get("src")
                if src:
                    image_dict[str(index)] = src
            
            # Update Firestore document with images
            if image_dict:
                db.collection('cars').document(car.id).update({
                    'images': image_dict
                })
                print(f"Saved {len(image_dict)} images for {year} {car_data['name']}")
            else:
                print(f"No images found for {year} {car_data['name']}")
        
        # Add a small delay to avoid overwhelming the server
        time.sleep(2)
        
    except Exception as e:
        print(f"Error processing {year} {car_data['name']}: {str(e)}")
        continue

# Close the browser when done
driver.quit()


