from usermodels import User
from housemodels import House, RealEstate, Group, Details
from Exceptions import UserNotFoundException, HouseNotFoundException
from flask import Flask, request, jsonify
import bcrypt
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/login", methods=["GET", "OPTIONS"])
def login_handler():
    """
    This endpoint is used to authenticate a user.
    The user must provide their email and password in the request body.
    If the credentials are valid, a JSON object containing the user's information will be returned.
    If the credentials are invalid, an error message will be returned.
    """
    if request.method == "OPTIONS":
        # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight request handled"})
        response.headers["Access-Control-Allow-Origin"] = (
            "*"  # Allow requests from any origin
        )
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST"  # Allow GET and POST methods
        )
        response.headers["Access-Control-Allow-Headers"] = (
            "Content-Type"  # Allow Content-Type header
        )
        return response, 200
    elif request.method == "GET":
        email = request.args.get("email")
        password = request.args.get("password")

        # both email and password are required
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        try:
            # retrieve user information from DB
            user_instance = User(
                username=email,
                password=password,
                payment_info="",
                user_type="",
                first_name="",
                last_name="",
                phone_number="",
                upcoming_tours = "", # Both landlords and tenants can have this, so this is uniform across both data.
                #TENANT RELATED DATA
                pending_requests = "", #stores requestID's sent over by House Clients
                housing_group = "",
                saved_properties = "",
                #LANDLORD RELATED DATA
                my_properties = ""

            )
            user_instance = user_instance.retrieve_user_info(email)
            user_info_dict = user_instance.to_dict()

            # check whether password matches hashed password stored in DB
            if bcrypt.checkpw(password.encode("utf-8"), user_instance.password):
                return jsonify({"error": "Incorrect password"}), 400

            # not sending password back to client for security reasons
            user_info_dict["password"] = ""
            return jsonify(user_info_dict), 200

        except UserNotFoundException as e:
            return jsonify({"error": f"{e}"}), 400

    return jsonify({"error": "Method Not Allowed"}), 405


@app.route("/register", methods=["POST", "OPTIONS"])
def register_handler():
    """
    This endpoint is used to register a new user.
    The request body must contain the user's information, including:
        1) email
        2) password
        3) first name
        4) last name
        5) phone number
        6) user type(landlord or tenant)
    The password will be hashed and stored in the database.
    A JSON object containing the registered user's information will be returned.
    If there is an error, an error message will be returned.
    """
    if request.method == "OPTIONS":
        # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight request handled"})
        response.headers["Access-Control-Allow-Origin"] = (
            "*"  # Allow requests from any origin
        )
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST"  # Allow GET and POST methods
        )
        response.headers["Access-Control-Allow-Headers"] = (
            "Content-Type"  # Allow Content-Type header
        )
        return response, 200

    elif request.method == "POST":
        try:
            # extract request body
            data = request.json

            # extract relevant fields
            first_name = data.get("firstName")
            last_name = data.get("lastName")
            phone_number = data.get("phoneNumber")
            email = data.get("email")
            password = data.get("password")
            user_type = data.get("userType")
            venmo_url = data.get("venmoURL")

            # hash the password:
            password_to_hash = password.encode("utf-8")
            salt = bcrypt.gensalt(10)
            hashed_password = bcrypt.hashpw(password_to_hash, salt)

            # Create an instance of User
            user_instance = User(
                username=email,
                password=hashed_password,
                payment_info=venmo_url,
                user_type=user_type,
                phone_number=phone_number,
                first_name=first_name,
                last_name=last_name,
                upcoming_tours = [], # Both landlords and tenants can have this, so this is uniform across both data.
                #TENANT RELATED DATA
                pending_requests = [], #stores requestID's sent over by House Clients
                housing_group = "",
                saved_properties = [],
                #LANDLORD RELATED DATA
                my_properties = []
            )
            if not user_instance.check_new_user():
                return jsonify({"error": "User already exists"}), 400

            # add user to DB
            user_instance.add_user_info()

            # this is used to send the password back to react
            #   --> password is not sent back to client for security reasons
            user_instance.password = ""
            return jsonify(user_instance.to_dict()), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 400

    return jsonify({"error": "Method Not Allowed"}), 405


@app.route("/tenant-home", methods=["GET", "OPTIONS", "POST"])
def tenant_handler():
    """
    This endpoint retrieves all entries from the MongoDB collection.
    """
    if request.method == "OPTIONS":
        # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight request handled"})
        response.headers["Access-Control-Allow-Origin"] = (
            "*"  # Allow requests from any origin
        )
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST"  # Allow GET and POST methods
        )
        response.headers["Access-Control-Allow-Headers"] = (
            "Content-Type"  # Allow Content-Type header
        )
        return response, 200
    elif request.method == "GET":
        group = request.args.get("housing_group")
        try:

            house_instance = House(
                property_address=group, property_owner="", group="", real_estate=""
            )
            house_instance = house_instance.retrieve_housing_info(group)

            all_housemates_array = []
            for i in house_instance.group.all_housemates:
                user_instance = User(
                    username=i,
                    password="",
                    payment_info="",
                    user_type="",
                    first_name="",
                    last_name="",
                    phone_number="",
                    upcoming_tours = "", # Both landlords and tenants can have this, so this is uniform across both data.
                    #TENANT RELATED DATA
                    pending_requests = "", #stores requestID's sent over by House Clients
                    housing_group = "",
                    saved_properties = "",
                    #LANDLORD RELATED DATA
                    my_properties = ""
                )
                user_instance = user_instance.retrieve_user_info(i)
                user_info_dict = user_instance.to_dict()
                user_info_dict["password"] = ""
                all_housemates_array.append(user_info_dict)

            # print(all_housemates_array)
            return jsonify(all_housemates_array), 200

        except HouseNotFoundException as e:
            return jsonify({"errortest": f"{e}"}), 400

@app.route("/landlord-home", methods=["GET", "POST", "OPTIONS"])
def landlord_handler():
    if request.method == "OPTIONS":
        # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight request handled"})
        response.headers["Access-Control-Allow-Origin"] = (
            "*"  # Allow requests from any origin
        )
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST"  # Allow GET and POST methods
        )
        response.headers["Access-Control-Allow-Headers"] = (
            "Content-Type"  # Allow Content-Type header
        )
        return response, 200

    elif request.method == "POST":
        try:
            # extract request body
            data = request.json
            address = data.get("property_address")
            intoduction = data.get("introduction")
            owner = data.get("property_owner")
            bedroom_count = data.get("bedroom_count")
            bathroom_count = data.get("bathroom_count")
            rent_price = data.get("rent_prices")
            laundry = data.get("laundry")
            pet_friendly = data.get("pet_friendly")
            images = data.get("images")
            available = data.get("available")

            detail_instance = Details(
                bedroom_count=bedroom_count, 
                bathroom_count=bathroom_count,
                appliances=[],
                laundry=laundry,
                pet_friendly=pet_friendly
            )

            realestate_instance = RealEstate(
                property_address=address,
                property_owner=owner,
                available=available,
                rent_price=rent_price,
                images=images,
                introduction=intoduction,
                details=detail_instance
            )
            group_instance = Group(
                property_address=address, 
                property_owner=owner,
                all_housemates=[]
            )

            house_instance = House(
                property_address=address,
                property_owner=owner, 
                group=group_instance, 
                real_estate=realestate_instance)
            print("Made House Object")
            house_instance.print_housing_info()
            
            # add user to DB
            house_instance.add_house_info()
            print("Added House Object")
            return jsonify(house_instance.to_dict()), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 400

    return jsonify({"error": "Method Not Allowed"}), 405


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8090)
