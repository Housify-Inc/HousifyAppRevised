import React, { useState, version } from "react";
import { FaCloudUploadAlt, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import './RegisterForm.css';

const RegisterForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [venmoURL, setVenmoUrl] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageName, setProfileImageName] = useState('Insert profile picture here');
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

    const handleVenmoUrlChange = (e) => {
        setVenmoUrl(e.target.value);
    };

    const handleProfileImageChange = (e) => {
        setProfileImage(e.target.files[0]);
        setProfileImageName(e.target.files[0].name); // Update state to hold the selected file
    };

    const handleClick = () => {
        document.getElementById('profileImageInput').click(); // Programmatically click the hidden file input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data object to be sent to the Flask server
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('phoneNumber', phoneNumber);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('userType', userType);
        formData.append('venmoURL', venmoURL);
        formData.append('profileImage', profileImage);


        try {
            // Make a POST request to your Flask server
            const response = await fetch('http://localhost:8090/register', {
                method: 'POST',
                body: formData,
            });
    
            // Check if registration was successful
            if (response.ok) {
                const responseData = await response.json();

                try {
                    // now get the profile image
                    const response2 = await fetch(`http://localhost:8090/image/${responseData.profile_picture}`, {
                        method: 'GET',
                    });

                    if (response2.ok) {
                        // converts the image data to be able to be loaded into profile image in front-end
                        const blob = await response2.blob();
                        const imageUrl = URL.createObjectURL(blob);
                        responseData.profile_picture = imageUrl;
                    }
                    else {
                        alert(response2.error || 'Something went wrong with trying to fetch profile picture');
                    }
                }
                catch (error) {
                    console.error('Failed to load image properly:', error);
                }

                localStorage.setItem('userSession', JSON.stringify(responseData));
                if (responseData.user_type === 'landlord') {
                    // Navigate to Landlord page
                    console.log('landlord');
                    console.log(responseData);
                    // change this navigation to landlord page
                    navigate('/landlord-home');
                } else if (responseData.user_type === 'tenant') {
                    // Navigate to Tenant page
                    console.log('tenant');
                    console.log(responseData);
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

                <div className="input-box">
                    <input 
                        type="url" 
                        placeholder="Venmo URL" 
                        value={venmoURL}
                        onChange={handleVenmoUrlChange}
                        required></input>
                    <FaLock className="icon"/>
                </div>

                <div className="input-box">
                    <input 
                        id="profileImageInput"
                        type="file" 
                        onChange={handleProfileImageChange}
                        accept="image/*" 
                        style={{ display: 'none' }} // Hide the actual file input
                        required
                    />
                    <input 
                        type="text" 
                        placeholder={profileImageName} // Display the placeholder or selected file name
                        onClick={handleClick} // Open the file dialog when the text field is clicked
                        readOnly // Prevent manual editing
                    />
                    <FaCloudUploadAlt className="icon" onClick={handleClick}/>
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
