import unittest

from pymongo import MongoClient
from datetime import datetime
from roommodels import Rooms, Messages
from bson import ObjectId

# class TestRoomModels(unittest.TestCase):
#     # def setUp():
#     #     # Connect to the MongoDB database
#     #     .client = MongoClient("mongodb+srv://housify-customer-account-test1:housify-customer-test1@directmessages.xzfffoj.mongodb.net/")
#     #     .db = .client.DM
#     #     .collection = .db.DirectMessages
#     #     print("here")
#     #     print(.collection)


#     # def test_insert():
#         # print("Before Insertion:", .collection.count_documents({}))

        
#         # dummy_message_data1 = Messages(text="Testing Insert Function", timestamp=str(datetime.utcnow()), sender="test@gmail.com")
#         # dummy_message_data2 = Messages(text="Testing Message Arrays", timestamp=str(datetime.utcnow()), sender="tenant1@gmail.com")
#         # dummy_room_data = Rooms(room_users=["test@gmail.com", "test2@gmail.com"],messages=[dummy_message_data1, dummy_message_data2])
        

#         # dummy_room_data.create_room()

#         # print("After Insertion:", .collection.count_documents({}))

#     def test_retrieve_data():
#         .client = MongoClient("mongodb+srv://housify-customer-account-test1:housify-customer-test1@directmessages.xzfffoj.mongodb.net/")
#         .db = .client.DM
#         .collection = .db.DirectMessages
#         print("here")
#         # print(.collection)


#         dummy_message_data = Messages(text="Testing Insert Function", timestamp=str(datetime.utcnow()), sender="test@gmail.com")
#         dummy_room_data = Rooms(room_users=["test@gmail.com", "test2@gmail.com"],messages=dummy_message_data)

#         final_room_data = dummy_room_data.retrieve_room_info(ObjectId('65e3c541b0cc891ee1dc38d8'))
        
#         # final_room_data.print_room_info()
#         print(f"Room Users: {final_room_data.retrieve_room_messages(ObjectId('65e3c541b0cc891ee1dc38d8'))}")

def test_retrieve_data():
    client = MongoClient("mongodb+srv://housify-customer-account-test1:housify-customer-test1@directmessages.xzfffoj.mongodb.net/")
    db = client.DM
    collection = db.DirectMessages
    cursor = collection.find({})
    print("here")
    for room in cursor:
        print(room)            

dummy_message_data1 = Messages(text="Testing this room with Rahul Ganesh", timestamp=str(datetime.utcnow()), sender="genshinplayer@gmail.com")
dummy_message_data2 = Messages(text="Sending this to Krish Praseeth", timestamp=str(datetime.utcnow()), sender="sleepysavant@gmail.com")
dummy_message_data3 = Messages(text="Hello Rahul", timestamp=str(datetime.utcnow()), sender="genshinplayer@gmail.com")
dummy_room_data = Rooms(room_users=["genshinplayer@gmail.com", "sleepysavant@gmail.com"],messages=[dummy_message_data1, dummy_message_data2])
print(dummy_room_data.messages)
id = '65e60ad1c73c0af797a3d0b7'
# dummy_room_data.add_message(id, dummy_message_data3)
final_room_data = dummy_room_data.retrieve_room_info(id)
# 65e60ad1c73c0af797a3d0b7
final_room_data.print_room_info()


# if __name__ == '__main__':
#     unittest.main()
        
        