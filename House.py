import Group
import RealEstate
from deprecated import deprecated

class House:
    def __init__(self, property_address, group, real_estate):
        self.property_address = property_address
        self.group = group,
        self.real_estate = real_estate

    def get_all_house_data(): #access database for all house data
        return NotImplemented
    
    def get_property_address(): #access database for property address data
        return NotImplemented
    
    def get_group(): #access database for housing group data
        return NotImplemented
    
    def get_real_estate(): #access database for real estate data
        return NotImplemented
    
    def set_property_address(): #insert database for property address data
        return NotImplemented
    
    def set_group(): #insert database for housing group data
        return NotImplemented
    
    def set_real_estate(): #insert database for real estate data
        return NotImplemented