import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import data from './data';
import PropertyForm from './PropertyForm';

const MyProperties = () => {
  // State to control the visibility of the form
  const [showForm, setShowForm] = useState(false);

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
        {data.map(card => (
          <div className='shadow-lg rounded-lg hover:bg-gray-100' key={card.id}>
            <img className='rounded-t-lg' src={card.img} alt=""/>
            <div className='p-5'>
              <h3 className='text-3x1 font-bold text-slate-400 mb-3'>{card.title}</h3>
              <p className='text-lg font-normal text-gray-400'>{card.text}</p>
            </div>
          </div>  
        ))}
      </div>  
    </main>
  );
};


export default MyProperties;