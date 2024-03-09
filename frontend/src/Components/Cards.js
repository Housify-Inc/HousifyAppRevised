import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

const Cards = () => {
  const [housingData, setHousingData] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const handleListings = async () => {
      const groupUrl = `http://localhost:8090/load_housing`;
      try {
        const response = await fetch(groupUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch housing data');
        }
        const housingData = await response.json();
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

  return (
    <main className='container mx-auto px-8'>
      <header>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">Housing Near Me</h1>
        </div>
      </header>
      <div className='grid lg:grid-cols-3 gap-6'>
        {housingData.map((card, index) => (
          <div key={index} className={`shadow-lg rounded-lg ${expandedCard === index ? 'bg-gray-100' : 'hover:bg-gray-100 text-slate-100'}`} onClick={() => handleCardClick(index)}>
            <img className='rounded-t-lg' src={card.img} alt="" />
            <div className='p-5 text-slate-100 hover:text-slate-700'>
              <h3 className='text-3x1 font-bold text-slate-700 mb-3'>{card.property_address}</h3>
              {card.real_estate.introduction}
              {expandedCard === index && (
                <div className="expanded-view">
                  <p>Owner: {card.property_owner}</p>
                  <p>Bedrooms: {card.real_estate.bedroom_count}</p>
                  <p>Bathrooms: {card.real_estate.bathroom_count}</p>
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

export default Cards;
