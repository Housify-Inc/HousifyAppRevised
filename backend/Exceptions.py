from deprecated import deprecated

class UserNotFoundException(Exception):
    pass

class UnexpectedLogicException(Exception):
    pass

class RestrictedActionException(Exception):
    pass

class HouseNotFoundException(Exception):
    pass

class RoomNotFoundException(Exception):
    pass

class InvalidUserTypeException(Exception):
    pass

class UserAlreadyExistsException(Exception):
    pass