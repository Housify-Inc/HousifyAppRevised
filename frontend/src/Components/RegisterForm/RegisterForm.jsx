import React, { useState } from "react";
import './RegisterForm.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const navigate = useNavigate();


    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data object to be sent to the Flask server
        const userData = {
            firstName,
            lastName,
            phoneNumber,
            email,
            password,
            userType,
        };

        try {
            // Make a POST request to your Flask server
            const response = await fetch('http://localhost:8090/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            // Check if registration was successful
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
    
                if (responseData.user_type === 'landlord') {
                    // Navigate to Landlord page
                    console.log('landlord');
                    // change this navigation to landlord page
                    navigate('/landlord-home');
                } else if (responseData.user_type === 'tenant') {
                    // Navigate to Tenant page
                    console.log('tenant');
                    // change this navigation to tenant page
                    navigate('/tenant-home');
                }
            } else {
                // Handle registration error
                const data = await response.json();
                alert(data.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="First Name" 
                        value={firstName}
                        onChange={handleFirstNameChange}
                        required></input>
                    <FaUser className="icon"/>
                </div>

                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="Last Name" 
                        value={lastName}
                        onChange={handleLastNameChange}
                        required></input>
                    <FaUser className="icon"/>
                </div>

                <div className="input-box">
                    <input 
                        type="tel" 
                        placeholder="Phone number: (xxx)-xxx-xxxx"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange} 
                        required></input>
                    <FaPhone className="icon"/>
                </div>

                <div className="input-box">
                    <select value={userType} onChange={handleUserTypeChange} required>
                        <option value="" disabled>Select your role</option>
                        <option value="tenant">Tenant</option>
                        <option value="landlord">Landlord</option>
                    </select>
                    <FaUser className="icon"/>
                </div>

                <div className="input-box">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={handleEmailChange}
                        required></input>
                    <IoIosMail className="icon"/>
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={handlePasswordChange}
                        required></input>
                    <FaLock className="icon"/>
                </div>

                <button type="submit">Sign Up</button>

                <div className="register-link">
                    <p>Already have an account? <Link to="/">Login</Link></p>
                </div>

            </form>
        </div>
    );
};

export default RegisterForm;
