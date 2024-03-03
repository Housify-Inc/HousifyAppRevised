from Exceptions import RoomNotFoundException
from pymongo import MongoClient
import certifi

ca = certifi.where()


class Messages:
    def __init__(self, text, timestamp, sender):
        self.text = text
        self.timestamp = timestamp
        self.sender = sender


class Rooms:
    def __init__(self, room_users, messages):
        self.room_users = room_users
        self.messages = messages

    @classmethod
    def from_dict(cls, room_dict):
        return cls(
            room_users=room_dict.get("room_users"),
            messages=[Messages(**msg) for msg in room_dict.get("messages", [])],
        )

    def to_dict(self):
        return {
            "room_users": self.room_users,
            "messages": [
                {"text": msg.text, "timestamp": msg.timestamp, "sender": msg.sender}
                for msg in self.messages
            ],
        }

    def create_room(self):
        self.client = MongoClient(
            "mongodb+srv://housify-customer-account-test1:housify-customer-test1@directmessages.xzfffoj.mongodb.net/",
            tlsCaFile=ca,
        )
        self.db = self.client.DM
        self.collection = self.db.DirectMessages

        room_data = self.to_dict()
        self.collection.insert_one(room_data)

    def retrieve_room_info(self, id=None):
        self.client = MongoClient(
            "mongodb+srv://housify-customer-account-test1:housify-customer-test1@directmessages.xzfffoj.mongodb.net/",
            tlsCaFile=ca,
        )
        self.db = self.client.DM
        self.collection = self.db.DirectMessages

        room = self.collection.find_one({"_id": id})

        if not room:
            raise RoomNotFoundException(f"No Room found with id: {id}")

        return self.from_dict(room)

    def retrieve_room_users(self, id=None):
        self.client = MongoClient(
            "mongodb+srv://housify-customer-account-test1:housify-customer-test1@directmessages.xzfffoj.mongodb.net/",
            tlsCaFile=ca,
        )
        self.db = self.client.DM
        self.collection = self.db.DirectMessages

        room = self.collection.find_one({"_id": id})

        if not room:
            raise RoomNotFoundException(f"No Room found with id: {id}")

        return room.get("room_users", [])

    def retrieve_room_messages(self, id=None):
        self.client = MongoClient(
            "mongodb+srv://housify-customer-account-test1:housify-customer-test1@directmessages.xzfffoj.mongodb.net/",
            tlsCaFile=ca,
        )
        self.db = self.client.DM
        self.collection = self.db.DirectMessages

        room = self.collection.find_one({"_id": id})

        if not room:
            raise RoomNotFoundException(f"No Room found with id: {id}")

        return room.get("messages", [])

    def print_room_info(self):
        print("Room Information")
        print(f"Room Users: {self.room_users}")
        print(f"Message Text: {self.messages.text}")
        print(f"Message Timestamp: {self.messages.timestamp}")
        print(f"Sender: {self.messages.sender}")
