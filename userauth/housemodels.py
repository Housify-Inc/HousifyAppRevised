from Exceptions import UserNotFoundException, HouseNotFoundException
from Exceptions import UnexpectedLogicException
from pymongo import MongoClient
import certifi

ca = certifi.where()

class Details:
    def __init__(self, bedroom_count, bathroom_count, appliances, laundry, pet_friendly):
        self.bedroom_count = bedroom_count
        self.bathroom_count = bathroom_count
        self.appliances = appliances
        self.laundry = laundry
        self.pet_friendly = pet_friendly


class RealEstate:
    def __init__(self, property_address, property_owner, available, rent_price, images, introduction, details):
        self.property_address = property_address
        self.property_owner = property_owner
        self.available = available
        self.rent_price = rent_price
        self.images = images
        self.introduction = introduction
        self.details = details


class Group:
    def __init__(self, property_address, property_owner, all_housemates):
        self.property_address = property_address
        self.property_owner = property_owner
        self.all_housemates = all_housemates


class House:
    def __init__(self, property_address, property_owner, group, real_estate):
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
                    # "appliances": self.real_estate.details.appliances,
                    # "laundry": self.real_estate.details.laundry,
                    # "pet_friendly": self.real_estate.details.pet_friendly
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
    