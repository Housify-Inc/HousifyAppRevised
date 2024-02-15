from Exceptions import UserNotFoundException
from Exceptions import UnexpectedLogicException
from pymongo import MongoClient

class Details:
    def __init__(self, bedroom_count, bathroom_count, appliances, laundry, pet_friendly):
        self.bedroom_count = bedroom_count
        self.bathroom_count = bathroom_count
        self.appliances = appliances
        self.laundry = laundry
        self.pet_friendly = pet_friendly


class RealEstate:
    def __init__(self, real_estate_address, available, real_estate_owner, real_estate_rent_price, real_estate_images, real_estate_introduction, details):
        self.real_estate_address = real_estate_address
        self.available = available
        self.real_estate_owner = real_estate_owner
        self.real_estate_rent_price = real_estate_rent_price
        self.real_estate_images = real_estate_images
        self.real_estate_introduction = real_estate_introduction
        self.details = details


class Group:
    def __init__(self, property_address, landlord_name, all_housemates):
        self.property_address = property_address
        self.landlord_name = landlord_name
        self.all_housemates = all_housemates


class House:
    def __init__(self, property_address, group, real_estate):
        self.property_address = property_address
        self.group = group
        self.real_estate = real_estate

    @classmethod
    def from_dict(self, house_dict):
        return self.__class__(
            property_address=house_dict.get('property_address'),
            group=Group(**house_dict.get('group')),
            real_estate=RealEstate(**house_dict.get('real_estate'))
        )

    def to_dict(self):
        return {
            "property_address": self.property_address,
            "group": {
                "property_address": self.group.property_address,
                "landlord_name": self.group.landlord_name,
                "all_housemates": self.group.all_housemates
            },
            "real_estate": {
                "real_estate_address": self.real_estate.real_estate_address,
                "available": self.real_estate.available,
                "real_estate_owner": self.real_estate.real_estate_owner,
                "real_estate_rent_price": self.real_estate.real_estate_rent_price,
                "real_estate_images": self.real_estate.real_estate_images,
                "real_estate_introduction": self.real_estate.real_estate_introduction,
                "details": {
                    "bedroom_count": self.real_estate.details.bedroom_count,
                    "bathroom_count": self.real_estate.details.bathroom_count,
                    "appliances": self.real_estate.details.appliances,
                    "laundry": self.real_estate.details.laundry,
                    "pet_friendly": self.real_estate.details.pet_friendly
                }
            }
        }
