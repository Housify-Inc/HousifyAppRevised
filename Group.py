import Tenant
from deprecated import deprecated

class Group:
    def __init__(self, property_address, landlord_name, all_housemates):
        self.property_address = property_address
        self.landlord_name = landlord_name
        self.all_housemates = all_housemates

    def get_all_house_group_data(): #access database for all housing group data
        return NotImplemented

    def get_property_address(): #access database for property address
        return NotImplemented

    def get_landlord_name(): #access database for landlord name
        return NotImplemented
    
    def get_all_housemates(): #access database for housemate data
        return NotImplemented
    
    def set_property_address(): #insert database for property address
        return NotImplemented

    def set_landlord_name(): #insert database for landlord name
        return NotImplemented
    
    def set_all_housemates(): #insert database for housemates
        return NotImplemented