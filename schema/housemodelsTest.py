import unittest
from pymongo import MongoClient
from housemodels import House

class TestHouseMethods(unittest.TestCase):
    def setUp(self):
        # Connect to the MongoDB database
        self.client = MongoClient("mongodb+srv://housify-customer-account-test1:housify-customer-test1@houseinfo.5nbfw82.mongodb.net/")
        self.db = self.client.HousesDatabase
        self.collection = self.db.HouseInfo

        # Clear the collection before insertion
        self.collection.delete_many({})

        # Print count before insertion
        print("Before Insertion:", self.collection.count_documents({}))

        # Insert a dummy document for testing
        dummy_data = {
            "property_address": "456 Oak St",
            "property_owner": "Jane Smith",
            "group": {
                "property_address": "456 Oak St",
                "property_owner": "Jane Smith",
                "all_housemates": ["TenantX", "TenantY", "TenantZ"]
            },
            "real_estate": {
                "property_address": "456 Oak St",
                "property_owner": "Jane Smith",
                "available": False,
                "rent_price": 2500,
                "images": ["image3.jpg", "image4.jpg"],
                "introduction": "A cozy home...",
                "details": {
                    "bedroom_count": 2,
                    "bathroom_count": 1,
                    "appliances": ["Refrigerator", "Stove", "Microwave"],
                    "laundry": False,
                    "pet_friendly": True
                }
            }
        }

        # Insert the dummy data into the collection
        self.collection.insert_one(dummy_data)

        # Print count after insertion
        print("After Insertion:", self.collection.count_documents({}))

    def test_read_house_from_database(self):
        # Test reading the dummy data from the database
        dummy_house = House.from_dict(self.collection.find_one())
        
        # Assertions to verify the retrieved data
        self.assertEqual(dummy_house.property_address, "456 Oak St")
        self.assertEqual(dummy_house.property_owner, "Jane Smith")


if __name__ == '__main__':
    unittest.main()
