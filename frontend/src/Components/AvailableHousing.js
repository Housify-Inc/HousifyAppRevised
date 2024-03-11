import React, { useState, useEffect } from 'react';
import { getResponseData } from '../ResponseHandler';

const Cards = () => {
  const responseData = getResponseData();
  const [housingData, setHousingData] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  useEffect(() => {
    const handleListings = async () => {
      try {
        const response = await fetch('http://localhost:8090/load_housing', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch housing data');
        }
        const housingData = await response.json();
        for (let i = 0; i < housingData.length; i++) {
          const house = housingData[i];
          try {
              const imageResponse = await fetch(`http://localhost:8090/property-image/${house.real_estate.image}`);
              if (imageResponse.ok) {
                  const blob = await imageResponse.blob();
                  const imageUrl = URL.createObjectURL(blob);
                  house.real_estate.image = imageUrl;
              } else {
                  console.error(`Failed to fetch image for house ${house.property_address}:`, imageResponse.status);
              }
          } catch (error) {
              console.error(`Failed to load image properly for house ${house.property_address}:`, error);
          }
      }
        setHousingData(housingData);
      } catch (error) {
        console.error('Error fetching housing data:', error);
      }
    };

    handleListings();
  }, []);

  const handleCardClick = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null); // Collapse the card if it's already expanded
    } else {
      setExpandedCard(index); // Expand the clicked card
    }
  };

  const handleTour = async (propertyAddress) => {
    const property = propertyAddress;

    const username = responseData.username;
    try {
      const response = await fetch('http://localhost:8090/handle-tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, property }),
      });
      if (response.ok) {
        // Handle success
        console.log('Tour request sent successfully');
      } else {
        // Handle error
        console.error('Failed to send tour request');
      }
    } catch (error) {
      console.error('Error sending tour request:', error);
    }
  };

  return (
    <main className='container mx-auto px-8'>
      <header>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">Housing Near Me</h1>
        </div>
      </header>
      <div className='grid lg:grid-cols-3 gap-6'>
        {housingData.map((card, index) => (
          <div key={index} className={`shadow-lg rounded-lg ${expandedCard === index ? 'bg-gray-100' : 'hover:bg-gray-100'}`} onClick={() => handleCardClick(index)}>
          <img className='rounded-t-lg w-full h-64 object-cover' src={card.real_estate.image} alt="" />
            <div className={`p-5 shadow-lg rounded-lg text-slate-100 ${expandedCard === index ? 'text-slate-700' : 'hover:text-slate-700'}`}>
              <h3 className='text-3xl font-bold text-slate-700 mb-3'>{card.property_address}</h3>
              <h3 className={`text-xl font-bold mb-3`}>{card.real_estate.introduction}</h3>
              {expandedCard === index && (
                <div className="expanded-view">
                  <p>Bedrooms: {card.real_estate.details.bedroom_count}</p>
                  <p>Bathrooms: {card.real_estate.details.bathroom_count}</p>
                  <p>Laundry: {card.real_estate.laundry ? 'Yes' : 'No'}</p>
                  <p>Pet Friendly: {card.real_estate.pet_friendly ? 'Yes' : 'No'}</p>
                  <p>Rent Price: {card.real_estate.rent_price}</p>
                  <p>Owner Contact Info: {card.real_estate.property_owner}</p>
                  {/* Add more information as needed */}
                  <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleTour(card.property_address)}>
                          Tour this Property
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Cards;

