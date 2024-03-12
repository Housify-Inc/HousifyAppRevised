import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import PropertyForm from './PropertyForm';
import { getResponseData } from '../../ResponseHandler';
import { Spinner } from 'react-bootstrap';

const MyProperties = () => {
  // State to control the visibility of the form
  const [showForm, setShowForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const responseData = getResponseData();
  const [expandedCard, setExpandedCard] = useState(null);
  const [propertiesData, setPropertiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submittedCardIndex, setSubmittedCardIndex] = useState(null);

  useEffect(() => {
    const handleListings = async () => {
        const propertiesUrl = `http://localhost:8090/landlord_properties?username=${responseData.username}`;
        try {
            const response = await fetch(propertiesUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
              setIsLoading(false);
                throw new Error('Failed to fetch housing data');
            }
            const properties = await response.json();
            // Loop through each property in the properties data and update the image field
            for (let i = 0; i < properties.length; i++) {
                const property = properties[i];
                try {
                    const imageResponse = await fetch(`http://localhost:8090/property-image/${property.real_estate.image}`);
                    if (imageResponse.ok) {
                        const blob = await imageResponse.blob();
                        const imageUrl = URL.createObjectURL(blob);
                        property.real_estate.image = imageUrl;
                    } else {
                        console.error(`Failed to fetch image for property ${property.property_address}:`, imageResponse.status);
                    }
                } catch (error) {
                    console.error(`Failed to load image properly for property ${property.property_address}:`, error);
                }
            }
            setIsLoading(false);
            setPropertiesData(properties);
            console.log("Properties for this Landlord", propertiesData);
        } catch (error) {
            console.error('Error fetching housing data:', error);
        }
    };

    handleListings();
}, []);

  // Function to toggle the visibility of the form
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Function to handle form submission
  const handleSubmit = async (e, index) => {
    e.preventDefault();
  
    // Get the current card's address
    const currentCard = propertiesData[expandedCard];
    const currentCardAddress = currentCard.property_address;
  
    // Form data with email and property address
    const formData = {
      email: email,
      property_address: currentCardAddress,
      property_owner: responseData.username,
    };

    try {
      console.log(formData);
      const response = await fetch('http://localhost:8090/group-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setSubmittedCardIndex(index);
        console.log("Request sent successfully");
      } else {
        const errorMessage = await response.text();
        console.error('Request failed:', errorMessage);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };
  
  const handleDeleteProperty = async(address) =>{
    console.log("this is the property address: ", address)
    const deleteTourUrl = 'http://localhost:8090/del_property';
        const response = await fetch(deleteTourUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: address
            }),
        });
        
        const responseDataPost = await response.json();
        
        if (response.ok) {
            console.log('Message added successfully:', responseDataPost);
        } else {
            console.error('Error adding message:', responseDataPost.error);
        }
  }

  const handleCardClick = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null); // Collapse the card if it's already expanded
    } else {
      setExpandedCard(index); // Expand the clicked card
    }
  };
  if (isLoading) {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status" style={{ color: 'white' }}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}
  return (
    <main className='container mx-auto px-8'>
      <header>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">My Properties</h1>
        <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleForm}
        >
        Add New Property
        </button>
        </div>
      </header>
      
      {/* Render the form if showForm is true */}
      {showForm && (
          <PropertyForm/>
        
      )}

      {/* Display property cards */}
      <div className='grid lg:grid-cols-3 gap-6'>
        {propertiesData.map((card, index) => (
          <div key={index} className={`shadow-lg rounded-lg ${expandedCard === index ? 'bg-gray-100' : 'hover:bg-gray-100'}`} onClick={() => handleCardClick(index)}>
          <img className='rounded-t-lg w-full h-64 object-cover' src={card.real_estate.image} alt="" />
            <div className={`p-5 shadow-lg rounded-lg text-slate-100 ${expandedCard === index ? 'text-slate-700' : 'hover:text-slate-700'}`}>
              <h3 className='text-3x1 font-bold text-slate-700 mb-3'>{card.property_address}</h3>
              <h3 className={'text-3x1 font-bold mb-3'}>{card.real_estate.introduction}</h3>
              {expandedCard === index && (
                <div className="expanded-view">
                  <p>Bedrooms: {card.real_estate.details.bedroom_count}</p>
                  <p>Bathrooms: {card.real_estate.details.bathroom_count}</p>
                  <p>Laundry: {card.real_estate.laundry ? 'Yes' : 'No'}</p>
                  <p>Pet Friendly: {card.real_estate.pet_friendly ? 'Yes' : 'No'}</p>
                  {/* Add more information as needed */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <Form onSubmit={(e) => handleSubmit(e, index)}>
                        <Form.Group controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter email"
                            value={email} // Set the value of the input field to the email state
                            onChange={(e) => setEmail(e.target.value)} // Update the email state when the user types
                          />
                        </Form.Group>
                        <div className="flex justify-between items-center mb-3 py-5">
                            {submittedCardIndex === index && (
                              <div className="text-green-500 font-bold mb-3">User added to group successfully!</div>
                            )}
                          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Submit
                          </button>
                        </div>
                      </Form>
                      <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                              onClick={() => handleDeleteProperty(card.property_address)}
                            >
                              Delete Property
                      </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};


export default MyProperties;