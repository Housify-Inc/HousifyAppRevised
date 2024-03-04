import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getResponseData } from '../ResponseHandler';

function PropertyForm() {
    const responseData = getResponseData();
    const [formData, setFormData] = useState({
        property_address: '',
        property_owner: '',
        available: false,
        rent_price: 0,
        images: [],
        introduction: '',
        bedroom_count: 0,
        bathroom_count: 0,
        appliances: [],
        laundry: false,
        pet_friendly: false
      });

      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        if (type === 'checkbox') {
            // For checkboxes, use the 'checked' value
            setFormData({
                ...formData,
                [name]: checked
            });
        } else if (name === 'bedroom_count' || name === 'bathroom_count' || name === 'rent_price') {
            // For numeric values (including 'rent_price'), parse the value to ensure it's stored as a number
            setFormData({
                ...formData,
                [name]: parseInt(value, 10) || 0 // Use '|| 0' to default to 0 if 'parseInt' fails (e.g., empty string)
            });
        } else {
            // For all other inputs, use the 'value' directly
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.property_owner = responseData.username;
        console.log(formData); // You can send the form data to your backend or perform other actions here
        try {
            const response = await fetch('http://localhost:8090/landlord-home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                console.log("House Added successfully");
            } else {
                const errorMessage = await response.text();
                console.error('House Addition failed:', errorMessage);
            }
        } catch (error) {
            console.error('House Addition failed:', error);
        }
    };
    

  return (
    <div className="container">
      <h1>Property Information Form</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="property_address">
          <Form.Label>Property Address:</Form.Label>
          <Form.Control type="text" name="property_address" value={formData.property_address} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group controlId="introduction">
          <Form.Label>Write A Quick Description of Your House</Form.Label>
          <Form.Control type="text" name="introduction" placeholder = "A beautiful property..." value={formData.introduction} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group controlId="bed">
          <Form.Label>Bedroom Count</Form.Label>
          <Form.Control type="text" name="bedroom_count" placeholder = "0" value={formData.bedroom_count} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group controlId="Bath Rooms">
          <Form.Label>Bathroom Count</Form.Label>
          <Form.Control type="text" name="bathroom_count" placeholder = "0" value={formData.bathroom_count} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group controlId="available">
          <Form.Check type="checkbox" label="Available" name="available" checked={formData.available} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group controlId="laundry">
          <Form.Check type="checkbox" label="Laundry" name="laundry" checked={formData.laundry} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group controlId="pet_friendly">
          <Form.Check type="checkbox" label="Pet Friendly?" name="pet_friendly" checked={formData.pet_friendly} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group controlId="rent_price">
          <Form.Label>Rent Price:</Form.Label>
          <Form.Control type="number" name="rent_price" value={formData.rent_price} onChange={handleInputChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default PropertyForm;
