import React from "react";
import './ForgotPasswordForm.css';
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
    return (
        <div className='wrapper'>
            <form action="">
                <h1>Forgot Password</h1>
                <div className="input-box">
                    <input type="email" placeholder="Email" required></input>
                    <FaUser className="icon"/>
                </div>

                <button type="submit">Send</button>
                <div className="register-link">
                    <p>Want to go back? <Link to="/">Login</Link></p>
                </div>

            </form>
        </div>
    );
};

export default ForgotPasswordForm;