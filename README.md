# Housify-App

## Your one-stop-shop for housing

### Contributors:

1.  Aravind Nair (Product Owner)
2.  Rahul Ganesh (Scrum Master)
3.  Shivam Adeshara (Developer)
4.  Krish Praseeth (Developer)

### Description

We are building an open source housing portal and housing search page in one with this web app, where it helps increase the communication between the tenants and landlord. This helps centralize all things housing to eliminate any confusion and hardship between the tenants and landlord with properties. Landlords can create listings for prospective tenants to look at who are looking for housing. They can request the landlord for tours. Landlords can invite prospective tenants to join the housing group and be an official tenant of the house. After, the tenant would then accept this request if they choose to join the landlord's group. The features within the group are the direct messaging and payment services. Anyone in the housing group can engage in direct messaging or group messaging.

### Dependencies/Installation/Setup Guidelines:

1.  Installing Stripe on Python Command: `pip install stripe`
2.  Installing Flask on Python: `pip install flask`
3.  Installing MongoDB: `pip install pymongo`
4.  Installing requests: `pip install requests`
5.  ReactJS / Tailwind setup `npm install react`, `npm install`, `npm install tailwindcss`

### Objects Reference:

1.  User Class - Creates either tenant or landlord details for the user.
2.  House Class - House Info - general house master class with property owner and landlord information
3.  Group Sub Class (master: HouseMaster) - housing group details of the House
4.  RealEstate Sub Class (master: HouseDescription) - real estate financial details
5.  Details Sub Class (master: RealEstate) - Additional details regarding the property used for real estate

### Database Reference:

1.  User Authentication / Retrieve User Info Database
2.  Real Estate Database
3.  MessageInfo Database

### Third-Party API being used (tentative):

1.  MongoDB Database API

Links:

1. https://stripe.com/docs/test-mode
2. https://stripe.com/docs/testing
3. https://stripe.com/docs/testing?testing-method=card-numbers
4. https://react-bootstrap.netlify.app/
5. https://pymongo.readthedocs.io/

### Technologies

1. MongoDB (Atlas)
2. Python
3. Flask
4. ReactJS
5. TailwindCSS
6. Bootstrap
