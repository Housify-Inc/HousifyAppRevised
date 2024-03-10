import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { getResponseData } from '../ResponseHandler';

function PropertyForm() {
    const responseData = getResponseData();
    const [formData, setFormData] = useState({
        property_address: '',
        available: false,
        rent_price: 0,
        introduction: '',
        bedroom_count: 0,
        bathroom_count: 0,
        laundry: false,
        pet_friendly: false,
    });
    const [propertyImage, setPropertyImage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (name === 'bedroom_count' || name === 'bathroom_count' || name === 'rent_price') {
            setFormData({ ...formData, [name]: parseInt(value, 10) || 0 });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        setPropertyImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Append form data
        let submissionFormData = new FormData();
        for (let key in formData) {
            submissionFormData.append(key, formData[key]);
        }
        submissionFormData.append('property_owner', responseData.username);

        // Append image
        if (propertyImage) {
            submissionFormData.append('propertyImage', propertyImage);
        }

        try {
            const response = await fetch('http://localhost:8090/landlord-home', {
                method: 'POST',
                body: submissionFormData, // Note: Don't set Content-Type header when using FormData
            });
            
            if (response.ok) {
              const responseData = await response.json();

              try {
                  // now get the property image
                  const response2 = await fetch(`http://localhost:8090/property-image/${responseData.real_estate.image}`, {
                      method: 'GET',
                  });

                  if (response2.ok) {
                      // converts the image data to be able to be loaded into property image in front-end
                      const blob = await response2.blob();
                      const imageUrl = URL.createObjectURL(blob);
                      responseData.profile_picture = imageUrl;
                  }
                  else {
                      alert(response2.error || 'Something went wrong with trying to fetch property picture');
                  }
              }
              catch (error) {
                  console.error('Failed to load image properly:', error);
              }


              console.log("House added successfully");
              console.log("Response Data received: ", responseData);
              // You might want to redirect the user or clear the form here
            } else {
                const errorMessage = await response.text();
                console.error('House addition failed:', errorMessage);
            }
        } catch (error) {
            console.error('House addition failed:', error);
        }
    };

    return (
        <div className="container">
            <h1>Property Information Form</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="property_address">
                    <Form.Label>Property Address:</Form.Label>
                    <Form.Control type="text" name="property_address" value={formData.property_address} onChange={handleInputChange} required />
                </Form.Group>

                <Form.Group controlId="introduction">
                    <Form.Label>Introduction:</Form.Label>
                    <Form.Control type="text" name="introduction" value={formData.introduction} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="bedroom_count">
                    <Form.Label>Bedroom Count:</Form.Label>
                    <Form.Control type="number" name="bedroom_count" value={formData.bedroom_count} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="bathroom_count">
                    <Form.Label>Bathroom Count:</Form.Label>
                    <Form.Control type="number" name="bathroom_count" value={formData.bathroom_count} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="rent_price">
                    <Form.Label>Rent Price:</Form.Label>
                    <Form.Control type="number" name="rent_price" value={formData.rent_price} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="available">
                    <Form.Check type="checkbox" label="Available" name="available" checked={formData.available} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="laundry">
                    <Form.Check type="checkbox" label="Laundry Available" name="laundry" checked={formData.laundry} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="pet_friendly">
                    <Form.Check type="checkbox" label="Pet Friendly" name="pet_friendly" checked={formData.pet_friendly} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="propertyImage">
                    <Form.Label>Upload Property Image:</Form.Label>
                    <Form.Control type="file" name="propertyImage" onChange={handleImageChange} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default PropertyForm;
