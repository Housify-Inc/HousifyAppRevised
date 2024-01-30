import React from 'react';
import data from "./data";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ImageSlider from './Carousel';

const Cards = () => {
    return(
    <main className = ' container mx-auto px-8 '>
        <header>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Properties</h1>
          </div>
        </header>
        <div className = ' grid lg:grid-cols-3 gap-6'>
          {data.map(card => (
            <div className = 'shadow-lg rounded-lg hover:bg-gray-100'>
              <img className = 'rounded-t-lg'src = {card.img} alt = " "/>
              <div className = 'p-5'>
                <h3 className ='text-3x1 font-bold text-slate-700 mb-3'>{card.title}</h3>
                <p className = 'text-lg font-normal text-gray-600'>{card.text}</p>
              </div>
            </div>  
        ))}
      </div>  
      </main>
    );
};

export default Cards;