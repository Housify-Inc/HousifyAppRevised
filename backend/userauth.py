from models import User, Tenant, Landlord
from Exceptions import UserNotFoundException
from flask import Flask, request, jsonify
import bcrypt
import logging

app = Flask(__name__)

# logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


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
            user_instance = User(username=email, password=password, payment_info="", user_type="")
            
            # Test retrieval of user information
            user_info = user_instance.retrieve_user_info(email)
            logger.debug("User Information:")
            logger.debug(f"Username: {user_info.username}")
            logger.debug(f"Password: {user_info.password}")
            logger.debug(f"Payment Info: {user_info.payment_info}")
            logger.debug(f"User Type: {user_info.user_type}")
            logger.debug(f"Additional Fields: {user_info.additional_fields}")

            # check whether password matches hashed password stored in DB
            passwordInDB = user_instance.get_password()
            if not bcrypt.checkpw(password.encode('utf-8'), passwordInDB.encode('utf-8')):
                return jsonify({"error": "Incorrect password"}), 400
            return jsonify(user_instance.to_dict()), 200
        
        except UserNotFoundException as e:
            return jsonify({"error" : f"{e}"}), 400
        
    return jsonify({"error" : "Method Not Allowed"}), 405

# wait for aravind to add the relevant user fields to models for register -- first name, last name, phone number
@app.route('/register', methods=['POST'])
def register_handler():
     pass
     


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8090)