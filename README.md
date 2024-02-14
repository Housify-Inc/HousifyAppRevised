# Housify-App

## Your one-stop-shop for housing

### Contributors:

1.  Aravind Nair (Product Owner)
2.  Rahul Ganesh (Scrum Master)
3.  Shivam Adeshara (Developer)
4.  Krish Praseeth (Developer)

### Dependencies/Installation/Setup Guidelines:

1.  Retrieve Stripe API Keys (requires SSN, Taxpayer Identification Number) - https://stripe.com/docs/api
2.  Installing Stripe on Python Command: `pip install stripe`
3.  Installing Flask on Python: `pip install flask`
4.  Installing MongoDB: `pip install pymongo`

### Objects Reference:

1.  Tenant Class - Tenant Info
2.  Landlord Class - Landlord Info
3.  House Class
4.  HouseGroup Sub Class (master: HouseMaster)
5.  HouseDescription Sub Class (master: HouseMaster)
6.  RealEstate Sub Class (master: HouseDescription)
7.  InteriorFeatures Sub Class (master: RealEstate)

### Database Reference:

1.  User Authentication / Retrieve User Info Database
2.  Real Estate Database

### Third-Party API being used (tentative):

1.  Stripe API
2.  MongoDB Database API
3.  Twilio Database API (tentative)

### Relevant Stripe API documentation:

1.  Setting up Test Cards:

Links:

1. https://stripe.com/docs/test-mode
2. https://stripe.com/docs/testing
3. https://stripe.com/docs/testing?testing-method=card-numbers
