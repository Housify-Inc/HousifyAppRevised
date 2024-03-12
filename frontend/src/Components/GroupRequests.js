import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { getResponseData, updateUser } from '../ResponseHandler';

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const responseData = getResponseData();

  useEffect(() => {
    // Fetch and set pending requests when component mounts
    setPendingRequests(responseData.pending_requests);
  }, []); // Ensure useEffect runs when pending_requests changes
  
  const handleAccept = async (request) => {
    try {
      // Send the request to the backend
      const response = await fetch('http://localhost:8090/accept-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify({ request }) // Send the request string directly
      });
  
      if (!response.ok) {
        
        throw new Error('Failed to accept request');
      }

      // Update pending requests after successful accept
      // setPendingRequests(pendingRequests.filter(req => req !== request));
      updateUser(responseData.username);
      console.log('Accepted:', request);

      // Update form data after successful accept
    } catch (error) {
      console.error('Failed to accept request properly:', error);
    }
  };  

  const handleReject = async (request) => {
    try {
      // Send the request to the backend
      const response = await fetch('http://localhost:8090/decline-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify({ request }) // Send the request string directly
      });
  
      if (!response.ok) {
        
        throw new Error('Failed to decline request');
      }
      
      updateUser(responseData.username);
      console.log('Rejected:', request);

      // Update pending requests after successful reject
      // setPendingRequests(pendingRequests.filter(req => req !== request));
    } catch (error) {
      console.error('Failed to reject request properly:', error);
    }
  };

  return (
    <div className="container mx-auto px-2 py-8">
      <h2 className="text-xl font-bold mb-4 text-slate-100">Pending Requests</h2>
      {pendingRequests.map((request, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-5 mb-5" style={{ borderRadius: '20px' }}>
          <div className="flex mt-4">
            <p className="font-bold px-5">Property Address: {request.split('-')[1]}</p>
            <Button variant="success" className="flex items-center justify-center px-2 py-1 bg-green-500 text-white rounded-md mr-2" onClick={() => handleAccept(request)}>Accept</Button>
            <Button variant="danger" className="flex items-center justify-center px-2 py-1 bg-red-500 text-white rounded-md" onClick={() => handleReject(request)}>Reject</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingRequests;
