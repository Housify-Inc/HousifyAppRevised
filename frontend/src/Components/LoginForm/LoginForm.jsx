import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import './LoginForm.css';
import { setResponseData } from "../../ResponseHandler";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

    
        // Construct the URL with query parameters
        // Will need to change this later when server hosted somewhere else
        const loginUrl = `http://localhost:8090/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    
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
            // add user object to session
            localStorage.setItem('userSession', JSON.stringify(responseData));
            if (responseData.user_type === 'landlord') {
                // Navigate to Landlord page
                console.log('landlord');
                // change this navigation to landlord page
                navigate('/landlord-home');
            }

            else if(responseData.user_type === 'tenant') {
                // Navigate to Tenant page
                console.log('tenant');
                // change this navigation to tenant page
                navigate('/tenant-home');
            }
            
        } else {
            // Handle incorrect credentials (show error message, etc.)
            alert(responseData.error || 'Something went wrong');
        }
    };
    

    return (
        <div className='wrapper'>
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    <IoIosMail className="icon"/>
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <FaLock className="icon"/>
                </div>
                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </form>
        </div>
    );
};


export default LoginForm;
