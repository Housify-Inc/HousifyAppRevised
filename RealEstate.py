import Landlord
from deprecated import deprecated


class RealEstate:
    def __init__(self, real_estate_address, available, real_estate_owner, real_estate_rent_price, real_estate_images, real_estate_introduction, real_estate_details):
        self.real_estate_address = real_estate_address
        self.available = available
        self.real_estate_owner = real_estate_owner
        self.real_estate_rent_price = real_estate_rent_price
        self.real_estate_images = real_estate_images
        self.real_estate_introduction = real_estate_introduction
        self.real_estate_details = real_estate_details

    def get_all_real_estate_data(): #access database for all real estate data
        return NotImplemented
    
    def get_real_estate_address():
        return NotImplemented
    
    def get_available():
        return NotImplemented
    
    def get_real_estate_owner():
        return NotImplemented
    
    def get_real_estate_rent_price():
        return NotImplemented
    
    def get_real_estate_images():
        return NotImplemented
    
    def get_real_estate_introduction():
        return NotImplemented
    
    def get_real_estate_details():
        return NotImplemented
    
    def set_real_estate_address():
        return NotImplemented
    
    def set_available():
        return NotImplemented
    
    def set_real_estate_owner():
        return NotImplemented
    
    def set_real_estate_rent_price():
        return NotImplemented
    
    def set_real_estate_images():
        return NotImplemented
    
    def set_real_estate_introduction():
        return NotImplemented
    
    def set_real_estate_details():
        return NotImplemented