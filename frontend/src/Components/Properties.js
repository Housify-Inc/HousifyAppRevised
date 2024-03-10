import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import data from './data';
import PropertyForm from './PropertyForm';
import { getResponseData } from '../ResponseHandler';

const MyProperties = () => {
  // State to control the visibility of the form
  const [showForm, setShowForm] = useState(false);
  const responseData = getResponseData();
  const [expandedCard, setExpandedCard] = useState(null);
  const [propertiesData, setPropertiesData] = useState([]);
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
          throw new Error('Failed to fetch housing data');
        }
        const properties = await response.json();
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
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted!');
  };

  const handleCardClick = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null); // Collapse the card if it's already expanded
    } else {
      setExpandedCard(index); // Expand the clicked card
    }
  };

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
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="mt-4 p-4 bg-white rounded">
            <PropertyForm/>
          </div>
        </div>
        
      )}

      {/* Display property cards */}
      <div className='grid lg:grid-cols-3 gap-6'>
        {propertiesData.map((card, index) => (
          <div key={index} className={`shadow-lg rounded-lg ${expandedCard === index ? 'bg-gray-100' : 'hover:bg-gray-100'}`} onClick={() => handleCardClick(index)}>
            <img className='rounded-t-lg' src={card.img} alt="" />
            <div className={`p-5 shadow-lg rounded-lg text-slate-100 ${expandedCard === index ? 'text-slate-700' : 'hover:text-slate-700'}`}>
              <h3 className='text-3x1 font-bold text-slate-700 mb-3'>{card.property_address}</h3>
              <h3 className={`text-3x1 font-bold mb-3`}>{card.real_estate.introduction}</h3>
              {expandedCard === index && (
                <div className="expanded-view">
                  <p>Bedrooms: {card.real_estate.details.bedroom_count}</p>
                  <p>Bathrooms: {card.real_estate.details.bathroom_count}</p>
                  <p>Laundry: {card.real_estate.laundry ? 'Yes' : 'No'}</p>
                  <p>Pet Friendly: {card.real_estate.pet_friendly ? 'Yes' : 'No'}</p>
                  {/* Add more information as needed */}
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