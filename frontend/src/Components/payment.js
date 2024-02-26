/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import React from 'react';
import { useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMoneyBill } from '@fortawesome/free-solid-svg-icons';
const Payment = () => {
  const [stripenumber, setStripeNum] = useState('');

  const handleStripeChange = (e) => {
    setStripeNum(e.target.value);
};
  const getPaymentInfo = async (e) => {

  }
  const handle_payment = async (e) => {
    e.preventDefault();


    // Construct the URL with query parameters
    // Will need to change this later when server hosted somewhere else
    const loginUrl = `http://localhost:8090/tenant-home`;

    // Make a GET request to your Flask API endpoint with query parameters
    const response = await fetch(loginUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const responseData = await response.json();
    console.log(responseData);
    // Dummy verification
    if (response.ok) {
      setStripeNum(responseData.username);
      console.log(stripenumber);  
    } else {
        // Handle incorrect credentials (show error message, etc.)
        alert(responseData.error || 'Something went wrong');
    }
  };
    return (
      <div className='mt-6'>
        <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
          Price
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="text"
            name="price"
            id="price"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="0.00"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="currency" className="sr-only">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            >
              <option>USD</option>
              <option>CAD</option>
              <option>EUR</option>
            </select>
          </div>
        </div>
        <button className="flex items-center justify-center px-6 py-1 bg-green-500 text-white rounded-md"
            onClick={handle_payment}>
        <FontAwesomeIcon icon={faMoneyBill} className="mr-1" />
          Pay
        </button>
      </div>
    )
  }
  export default Payment;
  