import React, { useState } from "react";
import './RegisterForm.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Link } from "react-router-dom";

const RegisterForm = () => {
    const [userType, setUserType] = useState('');

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    return (
        <div className='wrapper'>
            <form action="">
                <h1>Register</h1>
                <div className="input-box">
                    <input type="text" placeholder="First Name" required></input>
                    <FaUser className="icon"/>
                </div>

                <div className="input-box">
                    <input type="text" placeholder="Last Name" required></input>
                    <FaUser className="icon"/>
                </div>

                <div className="input-box">
                    <input type="tel" placeholder="Phone number: (xxx)-xxx-xxxx" required></input>
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
                    <input type="email" placeholder="Email" required></input>
                    <IoIosMail className="icon"/>
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required></input>
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
