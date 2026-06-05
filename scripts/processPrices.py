#!/usr/bin/env python3
import json
import random
import os

# Define brands and models to remove
BRANDS_TO_REMOVE = ['FERRARI', 'LAMBORGHINI']
SUPERCAR_KEYWORDS = ['VALKYRIE', 'VALHALLA', 'SUPERLEGGERA', 'GT 63 S', 'R8 GT', 'MCLAREN']

def should_remove(car):
    """Check if a car should be removed"""
    make = car['make'].upper()
    model = car['model'].upper()
    
    # Check if brand should be removed
    if make in BRANDS_TO_REMOVE:
        return True
    
    # Check for supercar keywords
    for keyword in SUPERCAR_KEYWORDS:
        if keyword in model:
            return True
    
    return False

def get_random_price(min_price=2000, max_price=35000):
    """Generate random price between min and max"""
    return random.randint(min_price, max_price)

# Read the JSON file
file_path = os.path.join(os.path.dirname(__file__), '../src/data/vehiclesData.json')
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total vehicles before: {len(data)}")

# Filter out removed brands and assign random prices
processed_data = []
for car in data:
    if not should_remove(car):
        car['price'] = get_random_price()
        processed_data.append(car)

print(f"Total vehicles after: {len(processed_data)}")
print(f"Removed: {len(data) - len(processed_data)} vehicles")

# Write back to the file
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(processed_data, f, indent=2)

print('✓ vehiclesData.json updated successfully!')
