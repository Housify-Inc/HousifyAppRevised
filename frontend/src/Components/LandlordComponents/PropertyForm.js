import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; // Import Col for better control over the layout
import { UserCircleIcon, PhotoIcon } from '@heroicons/react/24/solid'; // Import Heroicons icons
import { getResponseData } from '../../ResponseHandler';

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
    const [isSubmitted, setIsSubmitted] = useState(false);

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

              setIsSubmitted(true);
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
        <div className="container mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="mt-4 p-4 bg-white rounded shadow"> {/* Added shadow for depth */}
                <h1 className="text-3xl font-semibold mb-4">Property Information Form</h1>
                {isSubmitted ? ( // Show confirmation message if form is submitted
                    <div className="text-green-600 font-semibold mb-4">Form submitted successfully!</div>
                ) : (
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="property_address">
                        <Form.Label>Property Address:</Form.Label>
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                            <Form.Control className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" type="text" name="property_address" value={formData.property_address} onChange={handleInputChange} required />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="introduction">
                        <Form.Label>About:</Form.Label>
                        <Form.Control className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="text" name="introduction" value={formData.introduction} onChange={handleInputChange} />
                        <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about the property.</p>
                    </Form.Group>

                    <Row className="mb-3">
                            <Form.Group as={Col} controlId="bedroom_count">
                                <Form.Label>Bedroom Count:</Form.Label>
                                <Form.Control className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="number" name="bedroom_count" value={formData.bedroom_count} onChange={handleInputChange} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="bathroom_count">
                                <Form.Label>Bathroom Count:</Form.Label>
                                <Form.Control className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="number" name="bathroom_count" value={formData.bathroom_count} onChange={handleInputChange} />
                            </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="rent_price">
                        <Form.Label>Rent Price:</Form.Label>
                        <Form.Control className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="number" name="rent_price" value={formData.rent_price} onChange={handleInputChange} />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group className="mb-3" controlId="available">
                                <Form.Check className="form-check" type="checkbox" label="  Available" name="available" checked={formData.available} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="laundry">
                                <Form.Check className="form-check" type="checkbox" label="  Laundry Available" name="laundry" checked={formData.laundry} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="pet_friendly">
                                <Form.Check className="form-check" type="checkbox" label="  Pet Friendly" name="pet_friendly" checked={formData.pet_friendly} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="propertyImage">
                        <Form.Label>Upload Property Image:</Form.Label>
                        <div className="mt-2 flex items-center gap-x-3">
                            <PhotoIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                            <Form.Control className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" type="file" name="propertyImage" onChange={handleImageChange} />
                        </div>
                    </Form.Group>

                    <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                )}
            </div>
        </div>
    );
}

export default PropertyForm;
