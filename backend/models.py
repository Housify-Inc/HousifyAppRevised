from Exceptions import UserNotFoundException
from Exceptions import UnexpectedLogicException
from pymongo import MongoClient
import certifi

ca = certifi.where()



class User:
    def __init__(self, username, password, payment_info, user_type, additional_fields=None):
        self.username = username
        self.password = password
        self.payment_info = payment_info
        self.user_type = user_type
        self.additional_fields = additional_fields or {}

    def from_dict(self, user_dict):
        return self.__class__(
            username=user_dict.get('username'),
            password=user_dict.get('password'),
            payment_info=user_dict.get('payment_info'),
            user_type=user_dict.get('user_type'),
            additional_fields=user_dict.get('additional_fields')
        )

    def to_dict(self):
        return {key: value for key, value in self.__dict__.items() if not key.startswith("--")}
    
    def retrieve_user_info(self, username): #access database for complete user info
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        user = collection.find_one({"username": username})

        if not user:
            raise UserNotFoundException(f"No user found with the username: {username}")
        
        client.close()

        return self.from_dict(user)
    
    def get_password(self, username=None): #access database for password
        if username is None:
            self.password = self.retrieve_user_info(self.username).password
            return self.password
        else:
            self.password = self.retrieve_user_info(username).password
            return self.password
    
    def get_payment_info(self, username=None): #access database for password
        if username is None:
            self.payment_info = self.retrieve_user_info(self.username).payment_info
            return self.payment_info
        else:
            self.payment_info = self.retrieve_user_info(username).payment_info
            return self.payment_info
   
    def get_user_type(self, username=None): #access database for user type
        if username is None:
            self.user_type = self.retrieve_user_info(self.username).user_type
            return self.user_type
        else:
            self.user_type = self.retrieve_user_info(username).user_type
            return self.user_type 
    
    def update_profile_password(self, new_password, username=None):
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles
        if username is None:
            collection.update_one({"username": self.username}, {"$set": {"password": new_password}})
        else:
            collection.update_one({"username": username}, {"$set": {"password": new_password}})
        
        client.close()

    def update_profile_payment_info(self, new_payment_info, username=None):
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles
        if username is None:
            collection.update_one({"username": self.username}, {"$set": {"payment_info": new_payment_info}})
        else:
            collection.update_one({"username": username}, {"$set": {"payment_info": new_payment_info}})
        
        client.close()
        
    def print_user_info(self):
        print("User Information:")
        print(f"Username: {self.username}")
        print(f"Password: {self.password}")
        print(f"Payment Info: {self.payment_info}")
        print(f"User Type: {self.user_type}")
        print(f"Additional Fields: {self.additional_fields}")
    
    def add_user_info(self): #inserts user info into database
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        user_data = self.to_dict()
        collection.insert_one(user_data)

        client.close()
            
    def delete_user(self):
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        collection.delete_one({"username": self.username})

        client.close()

    def validate_username(self):
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        valid_user = collection.find_one({"username": self.username})

        client.close()

        # Return True if the username doesn't exist, False otherwise
        return valid_user is None
    





class Landlord(User):
    def __init__(self, username, password, payment_info, my_properties):
        super().__init__(username, password, payment_info, "landlord")
        self.additional_fields["my_properties"] = my_properties

    def from_dict(self, landlord_dict):
        return self.__class__(
            username=landlord_dict.get('username'),
            password=landlord_dict.get('password'),
            payment_info=landlord_dict.get('payment_info'),
            my_properties=landlord_dict.get('additional_fields', {}).get('my_properties', [])
        )
    
    def to_dict(self):
        return {key: value for key, value in self.__dict__.items() if not key.startswith("--")}

    def insert_landlord_info(self):
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        # Convert Landlord object to dictionary and insert into the database
        landlord_data = self.to_dict()
        collection.insert_one(landlord_data)
        
        client.close()

    def retrieve_landlord_info(self, username=None): #access database for all tenant data; use other getters to access information/just access once to get 
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        user = collection.find_one({"username": username})
        if not user:
            raise UserNotFoundException(f"No landlord user found with the username: {username}")
        
        client.close()

        return self.from_dict(user)
    
    def get_my_properties(self):
        # Access the database to retrieve my_properties
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        # Find the document in the database
        landlord_data = collection.find_one({"username": self.username})

        client.close()

        # Return my_properties if available, or an empty list
        return landlord_data.get('additional_fields', {}).get('my_properties', [])
    
    def remove_my_property(self, address):
        # Remove the specified address from my_properties
        if address in self.additional_fields["my_properties"]:
            self.additional_fields["my_properties"].remove(address)

        # Update the database with the modified Landlord data
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        # Update the document in the database
        filter_query = {"username": self.username}
        update_query = {"$set": {"additional_fields.my_properties": self.additional_fields["my_properties"]}}
        collection.update_one(filter_query, update_query)

        client.close()
    
class Tenant(User): #Tenant is subclass to User
    def __init__(self, username, password, payment_info, housing_group, saved_properties, upcoming_tours):
        super().__init__(username, password, payment_info, "tenant")
        self.additional_fields["housing_group"] = housing_group
        self.additional_fields["saved_properties"] = saved_properties
        self.additional_fields["upcoming_tours"] = upcoming_tours

    def from_dict(self, tenant_dict):
        return self.__class__(
            username=tenant_dict.get('username'),
            password=tenant_dict.get('password'),
            payment_info=tenant_dict.get('payment_info'),
            housing_group=tenant_dict.get('additional_fields', {}).get('housing_group', ''),
            saved_properties=tenant_dict.get('additional_fields', {}).get('saved_properties', []),
            upcoming_tours=tenant_dict.get('additional_fields', {}).get('upcoming_tours', [])
        )
    
    def to_dict(self):
        return {key: value for key, value in self.__dict__.items() if not key.startswith("--")}

    def insert_tenant_info(self):
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        # Convert Landlord object to dictionary and insert into the database
        landlord_data = self.to_dict()
        collection.insert_one(landlord_data)
        
        client.close()

    def retrieve_tenant_info(self): #access database for all tenant data; use other getters to access information/just access once to get 
        connection_string = "mongodb+srv://21aravindnair:harambe@userpasswords.pxdm1kt.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.UserInformation
        collection = db.UserProfiles

        user = collection.find_one({"username": self.username})
        if not user:
            raise UserNotFoundException(f"No landlord user found with the username: {self.username}")
        
        client.close()

        return self.from_dict(user)

    def get_housing_group(self, username=None): #access database for housing group
        if username is None:
            return self.additional_fields["housing_group"]
        else:
            return self.retrieve_tenant_info(username).additional_fields["housing_group"]

    def get_saved_properties(self, username=None): #access database for saved properties
        if username is None:
            return self.additional_fields["saved_properties"]
        else:
            return self.retrieve_tenant_info(username).additional_fields["saved_properties"]
    def get_upcoming_tours(self, username=None): #access database for upcoming tours
        if username is None:
            return self.additional_fields["upcoming_tours"]
        else:
            return self.retrieve_tenant_info(username).additional_fields["upcoming_tours"]
  
    def add_housing_group(self, housing_group): # insert database for housing group
        self.additional_fields["housing_group"] = housing_group
        self.insert_tenant_info()

    def remove_housing_group(self): # clears housing group from the object's database.
        self.additional_fields["housing_group"] = None
        self.insert_tenant_info()

    def insert_new_saved_property(self, saved_property): # inserting new saved property into the database.
        saved_properties = self.additional_fields["saved_properties"]
        saved_properties.append(saved_property)
        self.insert_tenant_info()

    def remove_new_saved_property(self, saved_property): # removing new saved property from the database.
        saved_properties = self.additional_fields["saved_properties"]
        saved_properties.remove(saved_property)
        self.insert_tenant_info()

    def add_upcoming_tour(self, tour): # insert into the database for upcoming tour
        upcoming_tours = self.additional_fields["upcoming_tours"]
        upcoming_tours.append(tour)
        self.insert_tenant_info()

    def remove_upcoming_tour(self, tour): # removes tour from the object.
        upcoming_tours = self.additional_fields["upcoming_tours"]
        upcoming_tours.remove(tour)
        self.insert_tenant_info()

    def clear_all_upcoming_tours(self): # removes all tours from the user profile in the database.
        self.additional_fields["upcoming_tours"] = []
        self.insert_tenant_info()

    def clear_all_saved_properties(self): # removes all saved properties from the user profile in the database.
        self.additional_fields["saved_properties"] = []
        self.insert_tenant_info()