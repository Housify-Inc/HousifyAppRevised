import House
from deprecated import deprecated

class Landlord:
    def __init__(self, username, password, payment_info, user_type, my_properties):
        self.username = username
        self.password = password
        self.payment_info = payment_info
        self.user_type = user_type
        self.my_properties = my_properties

    def get_all_landlord_data(): #access database for all tenant data; use other getters to access information/just access once to get 
        return NotImplemented
    
    @deprecated(reason='no functionality needed to acquire username; we use username for database query.')
    def get_username(): #access database for usernames
        return NotImplemented
    
    def get_password(): #access database for password
        return NotImplemented
    
    def get_payment_info(): #access database for payment info
        return NotImplemented
    
    def get_user_type(): #access database for user type
        return NotImplemented
    
    def get_my_properties(): #access database for my properties
        return NotImplemented
    
    @deprecated(reason='no functionality needed to acquire username; we use username for database query.')
    def set_username(): #insert database for usernames
        return NotImplemented
    
    def set_password(): #insert database for password
        return NotImplemented
    
    def set_payment_info(): #insert database for payment info
        return NotImplemented
    
    def set_user_type(): #insert database for user type
        return NotImplemented
    
    def set_my_properties(): #insert database for my properties
        return NotImplemented