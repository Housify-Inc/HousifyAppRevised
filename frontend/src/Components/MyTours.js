import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getResponseData } from '../ResponseHandler';
const Tours = () => {
  const responseData = getResponseData();
  console.log(responseData);
  const tours = responseData.upcoming_tours;
  console.log(tours);

  const handleDeleteTour = async (address) => {
    const deleteTourUrl = 'http://localhost:8090/delete_tour';
    console.log(address)
    console.log(responseData.username)
        const response = await fetch(deleteTourUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: responseData.username,
                property: address
            }),
        });
        
        const responseDataPost = await response.json();
        
        if (response.ok) {
            console.log('Message added successfully:', responseDataPost);
        } else {
            console.error('Error adding message:', responseDataPost.error);
        }
  }

  if (tours.length === 0) {
    return(
    <div className="flex justify-center items-start h-screen">
        <div className="max-w-98 px-10">
            <div className="mb-4">
                <h1 className="text-4xl font-bold text-slate-100">You do not have any Upcoming Tours</h1>
            </div>
        </div>
    </div>
    
    )
}
    return(
    <main className = ' container mx-auto px-8 '>
        <header>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">My Tours</h1>
          </div>
        </header>
        <div className = ' grid lg:grid-cols-3 gap-6'>
          {tours.map(card => (
            <div className = 'shadow-lg rounded-lg bg-gray-100'>
              <div className = 'p-5'>
              <div className="flex justify-between items-center mb-3">
                <h1 className="text-3xl font-bold text-slate-700">
                  {card.tour_address}
                </h1>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                  onClick={() => handleDeleteTour(card.tour_address)}
                >
                  Cancel Tour
                </button>
              </div>
                <h3 className ='text-3x1 font-bold text-slate-700 mb-3'>{card.first_name + " " + card.last_name}</h3>
                <p className = 'text-lg font-normal text-gray-600'>{card.phone_number}</p>
              </div>
            </div>  
        ))}
      </div>  
      </main>
    );
};
 
export default Tours;