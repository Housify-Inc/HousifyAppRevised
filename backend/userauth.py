from models import User, Tenant, Landlord
from Exceptions import UserNotFoundException
from flask import Flask, request, jsonify
import bcrypt

app = Flask(__name__)




@app.route('/login', methods=['GET'])
def login_handler():
    if request.method == 'GET':
        email = request.args.get('email')
        password = request.args.get('password')

        # both email and password are required
        if not email or not password:
                return jsonify({"error": "Email and password are required"}), 400
        
        try:
            # Create an instance of User
            user_instance = User(username=email, password=password, payment_info="", user_type="", first_name="", last_name="", phone_number="")
            
            # Retrieval of user information
            user_instance.retrieve_user_info(email)

            # check whether password matches hashed password stored in DB
            if not password.encode('utf-8') == user_instance.password.encode('utf-8'):
                return jsonify({"error": "Incorrect password"}), 400
            
            return jsonify(user_instance.to_dict()), 200
        
        except UserNotFoundException as e:
            return jsonify({"error" : f"{e}"}), 400
        
    return jsonify({"error" : "Method Not Allowed"}), 405

# wait for aravind to add the relevant user fields to models for register -- first name, last name, phone number
@app.route('/register', methods=['POST'])
def register_handler():
    if request.method == 'POST':
        try: 
            data = request.json
            
            # extract relevant fields
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            phone_number = data.get('phoneNumber')
            email = data.get('email')
            password = data.get('password')
            user_type = data.get('userType')

            # hash the password:
            password_to_hash = password.encode('utf-8')
            salt = bcrypt.gensalt(10)
            hashed_password = bcrypt.hashpw(password_to_hash, salt)

            user_instance = User(username=email, password=hashed_password, payment_info="", user_type=user_type, phone_number=phone_number, first_name=first_name, last_name=last_name)
            user_instance.add_user_info()

            # this is used to send the password back to react -- it needs to be in a certain format
            user_instance.password = ""

            return jsonify(user_instance.to_dict()), 201
        
        except Exception as e:
            return jsonify({"error": str(e)}), 400
        
    return jsonify({"error": "Method Not Allowed"}), 405
     


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8090)