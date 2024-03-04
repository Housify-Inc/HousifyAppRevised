from Exceptions import UserNotFoundException
from Exceptions import UnexpectedLogicException
from pymongo import MongoClient
import certifi
ca = certifi.where()


class User:
    """
    Class for representing a user in the system.
    """
    def __init__(self, username, password, first_name, last_name, phone_number, payment_info, user_type, pending_requests, housing_group, saved_properties, upcoming_tours, my_properties):
        self.username = username
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.phone_number = phone_number
        self.payment_info = payment_info
        self.user_type = user_type
        self.upcoming_tours = upcoming_tours # Both landlords and tenants can have this, so this is uniform across both data.
        #TENANT RELATED DATA
        self.pending_requests = pending_requests #stores requestID's sent over by House Clients
        self.housing_group = housing_group
        self.saved_properties = saved_properties
        #LANDLORD RELATED DATA
        self.my_properties = my_properties


    # @classmethod
    def from_dict(self, user_dict):
        return self.__class__(
            username=user_dict.get('username'),
            password=user_dict.get('password'),
            payment_info=user_dict.get('payment_info'),
            first_name=user_dict.get('first_name'),
            last_name=user_dict.get('last_name'),
            phone_number=user_dict.get('phone_number'),
            user_type=user_dict.get('user_type'),
            pending_requests=user_dict.get('pending_requests', []),
            housing_group=user_dict.get('housing_group'),
            saved_properties=user_dict.get('saved_properties', []),
            upcoming_tours=user_dict.get('upcoming_tours', []),
            my_properties=user_dict.get('my_properties', [])
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
    def retrieve_user_info(self, username): #access database for complete user info
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
    def get_password(self, username=None): #access database for password
        if username is None:
            self.password = self.retrieve_user_info(self.username).password
            return self.password
        else:
            self.password = self.retrieve_user_info(username).password
            return self.password
    
    # @classmethod
    def get_payment_info(self, username=None): #access database for password
        if username is None:
            self.payment_info = self.retrieve_user_info(self.username).payment_info
            return self.payment_info
        else:
            self.payment_info = self.retrieve_user_info(username).payment_info
            return self.payment_info

    # @classmethod    
    def get_user_type(self, username=None): #access database for user type
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
            collection.update_one({"username": self.username}, {"$set": {"password": new_password}})
        else:
            collection.update_one({"username": username}, {"$set": {"password": new_password}})
        
        client.close()

    # @classmethod
    def update_profile_payment_info(self, new_payment_info, username=None):
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles
        if username is None:
            collection.update_one({"username": self.username}, {"$set": {"payment_info": new_payment_info}})
        else:
            collection.update_one({"username": username}, {"$set": {"payment_info": new_payment_info}})
        
        client.close()
    
    def add_user_info(self): #inserts user info into database
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        user_data = self.to_dict()
        collection.insert_one(user_data)

        client.close()
            
    def delete_user(self): #use for when deleting a user from Housify's Services 
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
    