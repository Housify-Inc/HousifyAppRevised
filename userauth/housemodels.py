from Exceptions import UserNotFoundException, HouseNotFoundException, InvalidUserTypeException, UserAlreadyExistsException
from Exceptions import UnexpectedLogicException
from pymongo import MongoClient
from usermodels import User
import certifi

ca = certifi.where()

class Details:
    def __init__(self, bedroom_count=None, bathroom_count=None, appliances=None, laundry=None, pet_friendly=None):
        self.bedroom_count = bedroom_count
        self.bathroom_count = bathroom_count
        self.appliances = appliances
        self.laundry = laundry
        self.pet_friendly = pet_friendly


class RealEstate:
    def __init__(self, property_address=None, property_owner=None, available=None, rent_price=None, images=None, introduction=None, details=None):
        self.property_address = property_address
        self.property_owner = property_owner
        self.available = available
        self.rent_price = rent_price
        self.images = images
        self.introduction = introduction
        self.details = details


class Group:
    def __init__(self, property_address=None, property_owner=None, all_housemates=None):
        self.property_address = property_address
        self.property_owner = property_owner
        self.all_housemates = all_housemates


class House:
    def __init__(self, property_address=None, property_owner=None, group=None, real_estate=None):
        self.property_address = property_address
        self.property_owner = property_owner
        self.group = group
        self.real_estate = real_estate

    @classmethod
    def from_dict(cls, house_dict):
        return cls(
            property_address=house_dict.get('property_address'),
            property_owner=house_dict.get('property_owner'),
            group=Group(**house_dict.get('group')),
            real_estate=RealEstate(**house_dict.get('real_estate'))
        )

    def to_dict(self):
        return {
            "property_address": self.property_address,
            "property_owner": self.property_owner,
            "group": {
                "property_address": self.group.property_address,
                "property_owner": self.group.property_owner,
                "all_housemates": self.group.all_housemates
            },
            "real_estate": {
                "property_address": self.real_estate.property_address,
                "property_owner": self.real_estate.property_owner,
                "available": self.real_estate.available,
                "rent_price": self.real_estate.rent_price,
                "images": self.real_estate.images,
                "introduction": self.real_estate.introduction,
                "details": {
                    "bedroom_count": self.real_estate.details["bedroom_count"],
                    "bathroom_count": self.real_estate.details["bathroom_count"],
                    "appliances": self.real_estate.details["appliances"],
                    "laundry": self.real_estate.details["laundry"],
                    "pet_friendly": self.real_estate.details["pet_friendly"]
                }
            }
        }
    def retrieve_housing_info(self, property_address): #access database for complete user info
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@houseinfo.5nbfw82.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.HousesDatabase
        collection = db.HouseInfo

        house = collection.find_one({"property_address": property_address})

        if not house:
            raise HouseNotFoundException(f"No house found with the address: {property_address}")
        
        client.close()

        return self.from_dict(house)

    def print_housing_info(self):
        print(f"Groups: {self.group.all_housemates}")

    @classmethod
    def retrieve_available_listings_json(cls):
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@houseinfo.5nbfw82.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.HousesDatabase
        collection = db.HouseInfo

        # Retrieve all houses with the 'real_estate.available' field set to True
        available_houses_data = collection.find({"real_estate.available": True})

        # Create a list of House objects in JSON format
        available_listings_json = []
        for house_data in available_houses_data:
            available_listings_json.append(cls.from_dict(house_data).to_dict())

        client.close()

        return available_listings_json
    
    @classmethod
    def update_housing_info(self):
        connection_string = "mongodb+srv://housify-customer-account-test1:housify-customer-test1@houseinfo.5nbfw82.mongodb.net/"
        client = MongoClient(connection_string, tlsCaFile=ca) 
        db = client.HousesDatabase
        collection = db.HouseInfo

        # Check if the house already exists in the database
        existing_house = collection.find_one({"property_address": self.property_address})

        if not existing_house:
            raise HouseNotFoundException(f"No house found with the address: {self.property_address}")

        # Update the house information in the database
        collection.update_one({"property_address": self.property_address}, {"$set": self.to_dict()})

        client.close()

    ########################################################################
    # Real Estate Feature Method API Calls
    # ----------------------------------------------------------------
    # retrieve_properties(): retrieves basic data of properties of database into array of properties
    # use retrieve_house_info() to retrieve full house information
    # request_to_group(tenant_username): Landlord can request tenant to housing group
    # accept_request_to_group(property_address): Tenant can accept request to join landlord's housing group
    ########################################################################
    
    def request_to_group(self, tenant_username): #Requests user on behalf of house to join group
        # retrieve user's info
        user_instance = User.retrieve_user_info(tenant_username)
        # Check that the user type is landlord or if it is already in group (invalid cases to request)
        if user_instance.user_type == "landlord":
            raise InvalidUserTypeException(f"Invalid user type: {tenant_username}")
        if tenant_username in self.group["all_housemates"]:
            raise UserAlreadyExistsException(f"User {tenant_username} already exists in {self.property_address}")
        # Create requestID
        request_id = f"{tenant_username}-{self.property_address}"
        # Add request to user's pending_requests field
        user_instance.pending_requests.append(request_id)
        # update user's information in database
        user_instance.update_user_info()
        
        return request_id
    

    