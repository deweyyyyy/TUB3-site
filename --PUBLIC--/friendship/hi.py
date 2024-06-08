import json
import random
import string

# Function to generate a random secret code
def generate_secret_code():
    return ''.join(random.choice(string.digits) for _ in range(5))

# List of friend names in Thai script
friend_names = [
    "ปลื้ม", "กันต์", "ขวัญ", "ฟา", "ใบข้าว", "โนเบล", "อิงฟ้า", "มีนา", 
    "จันทร์เจ้า", "ผักกาดแก้ว", "ปริ้น", "ดิว", "เคอิจิ", "จุ้ย", "ผักโขม", 
    "แก้มหอม", "ข้าวหอม", "เทียนหอม", "ปิม", "ปั้น", "วันใส", "โจญ่า", 
    "น้ำอุ่น", "ภูผา", "ออม", "มดยิ้ม", "กรณ์", "โอพิ้งค์", "ฟีนิกซ์", 
    "ปาย", "มน", "เคอร์ฟิว", "นนท์", "บลู", "อริศ"
]

# Generate random user data
user_data = [{"name": name, "secretCode": generate_secret_code()} for name in friend_names]

# Create a JSON object with Thai characters
json_data = {"users": user_data}

# Write the JSON data to a file with utf-8 encoding
with open('./list.json', 'w', encoding='utf-8') as json_file:
    json.dump(json_data, json_file, ensure_ascii=False, indent=2)

print("list.json has been created.")
