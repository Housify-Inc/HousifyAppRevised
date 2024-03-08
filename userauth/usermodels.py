from Exceptions import UserNotFoundException
from Exceptions import UnexpectedLogicException
from Exceptions import HouseNotFoundException
from pymongo import MongoClient
from housemodels import House, Group, RealEstate, Details
from gridfs import GridFS, GridFSBucket
import certifi
from bson import ObjectId

ca = certifi.where()


class User:
    """
    Class for representing a user in the system.
    """
    def __init__(self, username=None, password=None, first_name=None, last_name=None, phone_number=None, payment_info=None, user_type=None, pending_requests=None, housing_group=None, saved_properties=None, upcoming_tours=None, my_properties=None, profile_picture=None):
        self.username = username
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.phone_number = phone_number
        self.payment_info = payment_info
        self.user_type = user_type
        self.profile_picture = profile_picture
        self.upcoming_tours = upcoming_tours  # Both landlords and tenants can have this, so this is uniform across both data.
        # TENANT RELATED DATA
        self.pending_requests = (
            pending_requests  # stores requestID's sent over by House Clients
        )
        self.housing_group = housing_group
        self.saved_properties = saved_properties
        # LANDLORD RELATED DATA
        self.my_properties = my_properties

    # @classmethod
    def from_dict(self, user_dict):
        return self.__class__(
            username=user_dict.get("username"),
            password=user_dict.get("password"),
            payment_info=user_dict.get("payment_info"),
            first_name=user_dict.get("first_name"),
            last_name=user_dict.get("last_name"),
            phone_number=user_dict.get("phone_number"),
            user_type=user_dict.get("user_type"),
            profile_picture=user_dict.get("profile_picture"),
            pending_requests=user_dict.get("pending_requests", []),
            housing_group=user_dict.get("housing_group"),
            saved_properties=user_dict.get("saved_properties", []),
            upcoming_tours=user_dict.get("upcoming_tours", []),
            my_properties=user_dict.get("my_properties", []),
        )

    def to_dict(self):
        # Convert all attributes to a dictionary
        user_dict = {
            "username": self.username,
            "password": self.password,
            "payment_info": self.payment_info,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "user_type": self.user_type,
            "pending_requests": self.pending_requests,
            "housing_group": self.housing_group,
            "saved_properties": self.saved_properties,
            "upcoming_tours": self.upcoming_tours,
            "my_properties": self.my_properties,
            "profile_picture": str(self.profile_picture),
        }
        return user_dict

    def print_user_info(self):
        print("User Information:")
        print(f"Username: {self.username}")
        print(f"Password: {self.password}")
        print(f"Payment Info: {self.payment_info}")
        print(f"User Type: {self.user_type}")
        print(f"Pending Requests: {self.pending_requests}")
        print(f"Housing Group: {self.housing_group}")
        print(f"Saved Properties: {self.saved_properties}")
        print(f"Upcoming Tours: {self.upcoming_tours}")
        print(f"My Properties: {self.my_properties}")

    # @classmethod
    def retrieve_user_info(self, username):  # access database for complete user info
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca)
        db = client.UserInformation
        collection = db.UserProfiles

        user = collection.find_one({"username": username})

        if not user:
            raise UserNotFoundException(f"No user found with the username: {username}")

        client.close()

        return self.from_dict(user)

    # @classmethod
    def get_password(self, username=None):  # access database for password
        if username is None:
            self.password = self.retrieve_user_info(self.username).password
            return self.password
        else:
            self.password = self.retrieve_user_info(username).password
            return self.password

    # @classmethod
    def get_payment_info(self, username=None):  # access database for password
        if username is None:
            self.payment_info = self.retrieve_user_info(self.username).payment_info
            return self.payment_info
        else:
            self.payment_info = self.retrieve_user_info(username).payment_info
            return self.payment_info

    # @classmethod
    def get_user_type(self, username=None):  # access database for user type
        if username is None:
            self.user_type = self.retrieve_user_info(self.username).user_type
            return self.user_type
        else:
            self.user_type = self.retrieve_user_info(username).user_type
            return self.user_type

    # @classmethod
    def update_profile_password(self, new_password, username=None):
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca)
        db = client.UserInformation
        collection = db.UserProfiles
        if username is None:
            collection.update_one(
                {"username": self.username}, {"$set": {"password": new_password}}
            )
        else:
            collection.update_one(
                {"username": username}, {"$set": {"password": new_password}}
            )

        client.close()

    # @classmethod
    def update_profile_payment_info(self, new_payment_info, username=None):
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca)
        db = client.UserInformation
        collection = db.UserProfiles
        if username is None:
            collection.update_one(
                {"username": self.username},
                {"$set": {"payment_info": new_payment_info}},
            )
        else:
            collection.update_one({"username": username}, {"$set": {"payment_info": new_payment_info}})
        
        client.close()
    
    def add_user_info(self): #inserts user info into database
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca)
        db = client.UserInformation
        collection = db.UserProfiles

        # add image to GridFS bucket
        fs_bucket = GridFSBucket(db)

        file_id = fs_bucket.upload_from_stream(
            self.profile_picture.filename,
            self.profile_picture,
            metadata={
                "contentType": self.profile_picture.content_type,
                "user": self.username,
            },
        )

        self.profile_picture = file_id

        user_data = self.to_dict()
        collection.insert_one(user_data)

        client.close()

    def delete_user(self):  # use for when deleting a user from Housify's Services
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca)
        db = client.UserInformation
        collection = db.UserProfiles

        collection.delete_one({"username": self.username})

        client.close()

    def check_new_user(self):
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca)
        db = client.UserInformation
        collection = db.UserProfiles

        valid_user = collection.find_one({"username": self.username})

        client.close()

        # Return True if the username doesn't exist, False otherwise
        return valid_user is None
    
    def serve_up_image(self, image_id):
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca)
        db = client.UserInformation

        # Retrieve the image file from GridFS
        fs_bucket = GridFSBucket(db)
        object_id = ObjectId(image_id)
        grid_out = fs_bucket.open_download_stream(object_id)
        contents = grid_out.read()

        # Send the image data back to the server
        return grid_out, contents
    

    # @classmethod
# def retrieve_landlord_property_info(landlord_username):
#     # retrieve the user info first
#     user_instance = User.retrieve_user_info(landlord_username)
#     # Check that the user type is landlord
#     if user_instance.user_type!= "landlord":
#         raise UserNotFoundException(f"No landlord found with the username: {landlord_username}")
#     # Retrieve the landlord's property info
#     return user_instance.my_properties

    # @classmethod
def retrieve_landlord_property_info(username):
    # Retrieve the user information
    user_info = User().retrieve_user_info(username)
    user_info.print_user_info()

    # Check if the user is a landlord
    if user_info.user_type == "landlord":
        print("ENTERED HERE FOR NAIRDELIVERS")
        # Get the list of property addresses owned by the landlord
        landlord_properties = user_info.my_properties

        # Retrieve the full information for each property
        landlord_property_info = []
        for property_address in landlord_properties:
            try:
                house_info = House().retrieve_housing_info(property_address)
                landlord_property_info.append(house_info.to_dict())
            except HouseNotFoundException as e:
                # Handle the exception
                print(str(e))

        return landlord_property_info
    else:
        # If the user is not a landlord, return an empty list
        return []

