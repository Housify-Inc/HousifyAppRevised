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
              <h1 className ='text-3x1 font-bold text-slate-700 mb-3'>{card.tour_address}</h1>
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