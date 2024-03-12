from usermodels import User, retrieve_landlord_property_info
from housemodels import House, RealEstate, Group, Details
from roommodels import Rooms, Messages
from pymongo import MongoClient
from gridfs import GridFS, GridFSBucket
from Exceptions import (
    UserNotFoundException,
    HouseNotFoundException,
    RoomNotFoundException,
)
from flask import Flask, request, jsonify, send_file
import bcrypt
import io
from flask_cors import CORS
import traceback

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/update_user", methods=["GET", "OPTIONS"])
def update_handler():
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
        try:
            print("hello")
            username = request.args.get("username")
            print(username)
            user_instance = User().retrieve_user_info(username=username)
            user_info_dict = user_instance.to_dict()
            user_instance.print_user_info()
            user_info_dict["password"] = ""
            return jsonify(user_info_dict), 200

        except Exception as e:
            print("\n\nCan't Update user data\n\n")
            return jsonify({"error": str(e)}), 404
        
@app.route("/property-image/<image_id>", methods=["GET", "OPTIONS"])
def serve_image_handler(image_id):
    """
    Serves up profile image for user from MongoDB
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
        try:
            house_instance = House(
                property_address="",
                property_owner="",
                group="",
                real_estate="",
            )
            grid_out, contents = house_instance.serve_up_image(image_id)

            # Send the image data back to the client
            return (
                send_file(
                    io.BytesIO(contents),
                    mimetype=grid_out.content_type,
                    as_attachment=True,
                    download_name=grid_out.filename,
                ),
                200,
            )
        except Exception as e:
            print("\n\nThis exception is getting triggered\n\n")
            traceback.print_exc()
            return jsonify({"error": str(e)}), 404

    return jsonify({"error": "Method Not Allowed"}), 405


@app.route("/image/<image_id>", methods=["GET", "OPTIONS"])
def serve_image(image_id):
    """
    Serves up profile image for user from MongoDB
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
        try:
            user_instance = User(
                username="",
                password="",
                payment_info="",
                user_type="",
                first_name="",
                last_name="",
                phone_number="",
                upcoming_tours="",  # Both landlords and tenants can have this, so this is uniform across both data.
                # TENANT RELATED DATA
                pending_requests="",  # stores requestID's sent over by House Clients
                housing_group="",
                saved_properties="",
                # LANDLORD RELATED DATA
                my_properties="",
                profile_picture="",
            )
            grid_out, contents = user_instance.serve_up_image(image_id)

            # Send the image data back to the client
            return (
                send_file(
                    io.BytesIO(contents),
                    mimetype=grid_out.content_type,
                    as_attachment=True,
                    download_name=grid_out.filename,
                ),
                200,
            )
        except Exception as e:
            print("\n\nThis exception is getting triggered\n\n")
            traceback.print_exc()
            return jsonify({"error": str(e)}), 404

    return jsonify({"error": "Method Not Allowed"}), 405


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
                upcoming_tours="",  # Both landlords and tenants can have this, so this is uniform across both data.
                # TENANT RELATED DATA
                pending_requests="",  # stores requestID's sent over by House Clients
                housing_group="",
                saved_properties="",
                # LANDLORD RELATED DATA
                my_properties="",
            )
            user_instance = user_instance.retrieve_user_info(email)
            user_info_dict = user_instance.to_dict()

            # check whether password matches hashed password stored in DB
            # FIX ME: I added not to this condition -- if that causes issue, look at this again.
            if not bcrypt.checkpw(password.encode("utf-8"), user_instance.password):
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
            if "profileImage" not in request.files:
                return jsonify({"error": "Profile image is required"}), 400

            profile_image = request.files["profileImage"]
            # Validate file name or type if necessary
            if not allowed_file(profile_image.filename):
                return jsonify({"error": "File type not allowed"}), 400

            # Assuming other form data is sent as form-data (not as JSON)
            first_name = request.form.get("firstName")
            last_name = request.form.get("lastName")
            phone_number = request.form.get("phoneNumber")
            email = request.form.get("email")
            password = request.form.get("password")
            user_type = request.form.get("userType")
            venmo_url = request.form.get("venmoURL")

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
                profile_picture=profile_image,
                upcoming_tours=[],  # Both landlords and tenants can have this, so this is uniform across both data.
                # TENANT RELATED DATA
                pending_requests=[],  # stores requestID's sent over by House Clients
                housing_group="",
                saved_properties=[],
                # LANDLORD RELATED DATA
                my_properties=[],
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
            landlord_instance = User(username=house_instance.property_owner);
            landlord_instance = landlord_instance.retrieve_user_info(house_instance.property_owner)
            landlord_info_dict = landlord_instance.to_dict()
            landlord_info_dict["password"] = ""
            all_housemates_array.append(landlord_info_dict)

            for i in house_instance.group.all_housemates:
                user_instance = User(
                    username=i,
                    password="",
                    payment_info="",
                    user_type="",
                    first_name="",
                    last_name="",
                    phone_number="",
                    upcoming_tours="",  # Both landlords and tenants can have this, so this is uniform across both data.
                    # TENANT RELATED DATA
                    pending_requests="",  # stores requestID's sent over by House Clients
                    housing_group="",
                    saved_properties="",
                    # LANDLORD RELATED DATA
                    my_properties="",
                )
                user_instance = user_instance.retrieve_user_info(i)
                user_info_dict = user_instance.to_dict()
                user_info_dict["password"] = ""
                all_housemates_array.append(user_info_dict)

            # print(all_housemates_array)
            return jsonify(all_housemates_array), 200

        except HouseNotFoundException as e:
            return jsonify({"errortest": f"{e}"}), 400


@app.route("/load_housing", methods=["GET", "POST", "OPTIONS"])
def housing_handler():
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
        try:
            print("here")
            house_instance = House(
                property_address="", property_owner="", group="", real_estate=""
            )
            return jsonify(house_instance.retrieve_available_listings_json()), 200
        except HouseNotFoundException as e:
            return jsonify({"errortest": f"{e}"}), 400


@app.route("/landlord_properties", methods=["GET", "POST", "OPTIONS"])
def properties_handler():
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
        landlord = request.args.get("username")
        try:
            return jsonify(retrieve_landlord_property_info(landlord)), 200
        except HouseNotFoundException as e:
            return jsonify({"errortest": f"{e}"}), 400


@app.route("/group-request", methods=["GET", "OPTIONS", "POST"])
def request_handler():
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
        data = request.json
        address = data.get("property_address")
        username = data.get("email")
        try:
            house_instance = House(property_address=address)
            requestid = house_instance.generate_request_id(username)
            user_instance = User(username=username)
            user_instance.add_request_id(requestid)
            return jsonify(user_instance.to_dict()), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

@app.route("/accept-request", methods=["GET", "POST", "OPTIONS"])
def accept_handler():
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
            data = request.json
            request_str = data["request"]  # Assuming the request is sent as a string# This will print the received request
            username, property_address = request_str.split("-")
            # Now you can use the request as needed
            # For demonstration, I'm just printing the request here
            user_instance = User(username=username)
            print(request_str)
            user_instance.accept_request(request_str)
            print("Request accepted:", request_str)

            return jsonify({"message": "Request accepted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

@app.route("/decline-request", methods=["GET", "POST", "OPTIONS"])
def decline_handler():
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
            data = request.json
            request_str = data["request"]  # Assuming the request is sent as a string# This will print the received request
            username, property_address = request_str.split("-")
            # Now you can use the request as needed
            # For demonstration, I'm just printing the request here
            user_instance = User(username=username)
            print(request_str)
            user_instance.reject_request(request_id=request_str)
            print("Request declined:", request_str)
            return jsonify({"message": "Request declined successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

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
            # if "propertyImage" not in request.files:
            #     return jsonify({"error": "Property image is required"}), 400

            # profile_image = request.files["propertyImage"]
            # # Validate file name or type if necessary
            # if not allowed_file(profile_image.filename):
            #     return jsonify({"error": "File type not allowed"}), 400

            # extract request body
            address = request.form["property_address"]
            introduction = request.form["introduction"]
            owner = request.form["property_owner"]
            bedroom_count = int(request.form["bedroom_count"])
            bathroom_count = int(request.form["bathroom_count"])
            rent_price = float(request.form["rent_price"])
            laundry = request.form["laundry"] == "true"
            pet_friendly = request.form["pet_friendly"] == "true"
            available = request.form["available"] == "true"

            # Handle the image file
            if "propertyImage" not in request.files:
                return jsonify({"error": "Property image is required"}), 400

            property_image = request.files["propertyImage"]

            detail_instance = Details(
                bedroom_count=bedroom_count,
                bathroom_count=bathroom_count,
                appliances=[],
                laundry=laundry,
                pet_friendly=pet_friendly,
            )

            realestate_instance = RealEstate(
                property_address=address,
                property_owner=owner,
                available=available,
                rent_price=rent_price,
                image=property_image,
                introduction=introduction,
                details=detail_instance,
            )
            group_instance = Group(
                property_address=address, property_owner=owner, all_housemates=[]
            )

            house_instance = House(
                property_address=address,
                property_owner=owner,
                group=group_instance,
                real_estate=realestate_instance,
            )
            print("Made House Object")
            house_instance.print_housing_info()

            # make a userinstance to update propertieis
            user_instance = User(
                username=owner,
                password="",
                payment_info="",
                user_type="",
                first_name="",
                last_name="",
                phone_number="",
                upcoming_tours="",  # Both landlords and tenants can have this, so this is uniform across both data.
                # TENANT RELATED DATA
                pending_requests="",  # stores requestID's sent over by House Clients
                housing_group="",
                saved_properties="",
                # LANDLORD RELATED DATA
                my_properties="",
            )
            user_instance = user_instance.retrieve_user_info(owner)
            user_instance.add_property(address)
            user_instance.update_user_properties()
            # add user to DB
            house_instance.add_house_info()
            print("Added House Object")
            return jsonify(house_instance.to_dict()), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 400

    return jsonify({"error": "Method Not Allowed"}), 405


@app.route("/get-room", methods=["GET", "OPTIONS", "POST"])
def room_handler():
    """
    This endpoint retrieves the room containing both users
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
        sender = request.args.get("sender")
        receiver = request.args.get("receiver")
        if not sender or not receiver:
            return jsonify({"error": "Sender and Receiver are both required!"}), 400
        try:
            room_object = None
            users_involved = [sender, receiver]
            users_involved.sort()
            room_instance = Rooms(room_users=users_involved, messages=[])
            for room in room_instance.retrieve_all_rooms():
                room["room_users"].sort()
                print(room["room_users"], users_involved)
                if users_involved == room["room_users"]:
                    room_object = room
                    break
            if room_object is None:
                return jsonify(room_instance.create_room()), 201
            # print(all_housemates_array)
            return jsonify(room_object), 200

        except RoomNotFoundException as e:
            return jsonify({"errortest": f"{e}"}), 400

@app.route("/get-group-chat", methods=["GET", "OPTIONS", "POST"])
def group_chat_handler():
    """
    This endpoint retrieves the room containing both users
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
        house = request.args.get("house")
        if not house:
            return jsonify({"error": "House is required"}), 400
        try:
            room_object = None
            house_array = [house]
            room_instance = Rooms(room_users=house_array, messages=[])
            for room in room_instance.retrieve_all_rooms():
                print(room["room_users"], house_array)
                if house_array == room["room_users"]:
                    room_object = room
                    break
            if room_object is None:
                return jsonify(room_instance.create_room()), 201
            # print(all_housemates_array)
            return jsonify(room_object), 200

        except RoomNotFoundException as e:
            return jsonify({"errortest": f"{e}"}), 400
        
@app.route("/handle-tours", methods=["OPTIONS", "POST"])
def tours_handler():
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
            data = request.json
            username = data.get("username")
            address = data.get("property")
            user_instance = User(username=username)
            return jsonify(user_instance.add_tour(address)), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    return jsonify({"error": "Method Not Allowed"}), 405
    
@app.route("/add-msg", methods=["OPTIONS", "POST"])
def message_handler():
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
            room_id = data.get("room_id")
            new_message_text = data.get("text")
            new_message_timestamp = data.get("timestamp")
            new_message_sender = data.get("sender")

            # Create an instance of Messages
            new_message = Messages(
                text=new_message_text,
                timestamp=new_message_timestamp,
                sender=new_message_sender,
            )

            # Create an instance of Rooms
            room_instance = Rooms(room_users=[], messages=[])
            room_instance.add_message(room_id, new_message)

            return jsonify(room_instance.to_dict()), 200
        except RoomNotFoundException as e:
            return jsonify({"errortest": f"{e}"}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8090)
