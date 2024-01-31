import React, { useState } from "react";
import './LoginForm.css';
import { FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMail } from "react-icons/io";

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
        const loginUrl = `http://localhost:8090/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    
        // Make a GET request to your Flask API endpoint with query parameters
        const response = await fetch(loginUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        const responseData = await response.json();
    
        // Dummy verification
        if (response.ok) {
            // Redirect to HomePage
            navigate('/home');
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
                <div className="remember-forgot">
                    <label><input type="checkbox"></input>Remember me</label>
                    <Link to="/forgot-password">Forgot password?</Link>
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
