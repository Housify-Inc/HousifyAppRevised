import unittest

from pymongo import MongoClient
from datetime import datetime
from roommodels import Rooms, Messages
from bson import ObjectId

class TestRoomModels(unittest.TestCase):
    # def setUp(self):
    #     # Connect to the MongoDB database
    #     self.client = MongoClient("mongodb+srv://housify-customer-account-test1:housify-customer-test1@directmessages.xzfffoj.mongodb.net/")
    #     self.db = self.client.DM
    #     self.collection = self.db.DirectMessages

    # def test_insert(self):
        # print("Before Insertion:", self.collection.count_documents({}))

        
        # dummy_message_data1 = Messages(text="Testing Insert Function", timestamp=str(datetime.utcnow()), sender="test@gmail.com")
        # dummy_message_data2 = Messages(text="Testing Message Arrays", timestamp=str(datetime.utcnow()), sender="tenant1@gmail.com")
        # dummy_room_data = Rooms(room_users=["test@gmail.com", "test2@gmail.com"],messages=[dummy_message_data1, dummy_message_data2])
        

        # dummy_room_data.create_room()

        # print("After Insertion:", self.collection.count_documents({}))

    def test_retrieve_data(self):
        dummy_message_data = Messages(text="Testing Insert Function", timestamp=str(datetime.utcnow()), sender="test@gmail.com")
        dummy_room_data = Rooms(room_users=["test@gmail.com", "test2@gmail.com"],messages=dummy_message_data)

        final_room_data = dummy_room_data.retrieve_room_info(ObjectId('65e3c541b0cc891ee1dc38d8'))
        
        # final_room_data.print_room_info()
        print(f"Room Users: {final_room_data.retrieve_room_messages(ObjectId('65e3c541b0cc891ee1dc38d8'))}")

            


if __name__ == '__main__':
    unittest.main()
        
        