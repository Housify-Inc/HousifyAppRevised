import unittest
from unittest.mock import MagicMock, patch
from usermodels import User, Landlord, Tenant
from Exceptions import UserNotFoundException

class TestModels(unittest.TestCase):
    def setUp(self):
        # Set up any necessary objects or configurations before each test
        pass

    def tearDown(self):
        # Clean up after each test
        pass

    @patch('models.MongoClient')
    def test_retrieve_user_info(self, mock_mongo_client):
        # Mock MongoClient to prevent actual database access
        mock_collection = MagicMock()
        mock_mongo_client.return_value.UserInformation.UserProfiles = mock_collection

        # Create a test user
        test_user = User(username="test_user", password="password", first_name="John", last_name="Doe",
                         phone_number="123456789", payment_info="credit_card", user_type="tenant")

        # Mock the find_one method to return user data
        mock_collection.find_one.return_value = {
            "username": "test_user",
            "password": "password",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "123456789",
            "payment_info": "credit_card",
            "user_type": "tenant",
            "additional_fields": {
                "housing_group": "TestHousingGroup",
                "saved_properties": ["Property1", "Property2"],
                "upcoming_tours": ["Tour1", "Tour2"]
            }
        }

        # Call the method to retrieve user info
        result_user = test_user.retrieve_user_info("test_user")

        # Assertions
        mock_collection.find_one.assert_called_with({"username": "test_user"})
        self.assertEqual(result_user.username, "test_user")
        self.assertEqual(result_user.password, "password")
        self.assertEqual(result_user.first_name, "John")
        self.assertEqual(result_user.last_name, "Doe")
        self.assertEqual(result_user.phone_number, "123456789")
        self.assertEqual(result_user.payment_info, "credit_card")
        self.assertEqual(result_user.user_type, "tenant")
        self.assertEqual(result_user.additional_fields["housing_group"], "TestHousingGroup")
        self.assertEqual(result_user.additional_fields["saved_properties"], ["Property1", "Property2"])
        self.assertEqual(result_user.additional_fields["upcoming_tours"], ["Tour1", "Tour2"])

    # Add more test cases for other methods in the models.py file

if __name__ == '__main__':
    unittest.main()
