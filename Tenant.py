import House
from deprecated import deprecated

class Tenant:
    def __init__ (self, username, password, payment_info, user_type, housing_group, saved_properties, upcoming_tours):

        self.username = username #e-mail address for all usernames
        self.password = password
        self.payment_info = payment_info
        self.user_type = user_type
        self.housing_group = housing_group
        self.saved_properties = saved_properties
        self.upcoming_tours = upcoming_tours

    def get_all_tenant_data(): #access database for all tenant data; use other getters to access information/just access once to get 
        return NotImplemented

    @deprecated(reason='no functionality needed to acquire username; we use username for database query.')
    def get_username(): #access database for username (NOT USING THIS; DEPRECATED)
        return NotImplemented

    def get_password(): #access database for password
        return NotImplemented
    
    def get_payment_info(): #access database for payment info
        return NotImplemented

    def get_user_type(): #access database for user type
        return NotImplemented

    def get_housing_group(): #access database for housing group
        return NotImplemented

    def get_saved_properties(): #access database for saved properties
        return NotImplemented

    def get_upcoming_tours(): #access database for upcoming tours
        return NotImplemented
    
    @deprecated(reason='no functionality needed to acquire username; we use username for database query.')
    def set_username(): #insert database for username (NOT USING THIS; DEPRECATED)
        return NotImplemented

    def set_password(): #insert database for password
        return NotImplemented
    
    def set_payment_info(): #insert database for payment info
        return NotImplemented

    def set_user_type(): #insert database for user type
        return NotImplemented

    def set_housing_group(): #insert database for housing group
        return NotImplemented

    def set_saved_properties(): #insert database for saved properties
        return NotImplemented

    def set_upcoming_tours(): #insert database for upcoming tours
        return NotImplemented 