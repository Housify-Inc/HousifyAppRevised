import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import Messenger from './Messenger';
import Payment from './payment';
import { getResponseData } from '../ResponseHandler';
import { useIsRTL } from 'react-bootstrap/esm/ThemeProvider';

const Tenants = () => {
    const responseData = getResponseData();
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showMessenger, setShowMessenger] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    console.log(responseData.my_properties);
    useEffect(() => {
        const handleGroup = async () => {
            if (!responseData.my_properties) {
                setIsLoading(false); // Set loading to false if there are no housing groups
                return;
            }
            // Create an array to store promises for fetching housing group data
            const promises = responseData.my_properties.map(async (property) => {
                const groupUrl = `http://localhost:8090/tenant-home?housing_group=${encodeURIComponent(property)}`;
                const response = await fetch(groupUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return response.json();
            });
    
            // Wait for all promises to resolve
            const groupDataArray = await Promise.all(promises);
    
            // Update state with fetched housing group data
            setUsers(groupDataArray);
            console.log(users);
            setIsLoading(false); // Set loading to false after data is fetched
        };
        handleGroup();
    }, [responseData.my_properties]);
    
    const handleMessageClick = (user) => {
        setShowMessenger(!showMessenger);
        setSelectedUser(user);
    };

    const handlePaymentButtonClick = (user, event) => {
        event.preventDefault();
        window.open(user.payment_info, '_blank');
    };

    if (isLoading) {
        return <div>Loading...</div>; // Show loading message while fetching data
    }

    if (!responseData.housing_group) {
        return(
        <div className="flex justify-center items-start h-screen">
            <div className="max-w-98 px-10">
                <div className="mb-4">
                    <h1 className="text-4xl font-bold text-slate-100">You are not in any Housing Groups</h1>
                </div>
            </div>
        </div>
        
        )
    }

    return (
        <div className="container mx-auto px-2 py-8 flex">
            {users.map((userOrArray, index) => (
                // Check if userOrArray is empty or undefined
                userOrArray && userOrArray.length > 0 && (
                    <div key={index} className="w-half max-w-98 px-10 bg-white rounded-lg py-4 shadow-lg" style={{ paddingTop: '10vh' }}>
                        <div className="max-w-98 px-10">
                            <div className="mb-4">
                                {Array.isArray(userOrArray) ? (
                                    userOrArray.length > 0 && userOrArray[0].housing_group && (
                                        <h1 className="text-xl font-bold">{userOrArray[0].housing_group}</h1>
                                    )
                                ) : (
                                    userOrArray.housing_group && (
                                        <h1 className="text-xl font-bold">{userOrArray.housing_group}</h1>
                                    )
                                )}
                            </div>
                        </div>
                        <ul role="list" className="ml-0">
                            {Array.isArray(userOrArray) && userOrArray.map((person, i) => (
                                <li key={i} className={`flex justify-between gap-x-6 py-5 pl-4 pr-4`}>
                                    <div className="flex min-w-0 gap-x-4">
                                        <div className="min-w-0 flex-auto">
                                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.first_name + " " + person.last_name}</p>
                                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.phone_number}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-x-2">
                                        <button
                                            className="flex items-center justify-center px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                                            onClick={() => handleMessageClick(person)}
                                        >
                                            <FontAwesomeIcon icon={faComment} className="mr-1" />
                                            Message
                                        </button>
                                        <button
                                            className="flex items-center justify-center px-6 py-1 bg-green-500 text-white rounded-md"
                                            onClick={(event) => handlePaymentButtonClick(person, event)}
                                        >
                                            <FontAwesomeIcon icon={faMoneyBill} className="mr-1" />
                                            Pay
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
            {showPaymentForm && (
                <div className="w-half max-w-98 px-10 bg-white rounded-lg py-4 shadow-lg">
                    <h2 className="text-xl font-bold mb-2">Payment Form</h2>
                    <Payment />
                </div>
            )}
            {showMessenger && (
                    <div  className="w-half max-w-98 px-10 bg-white rounded-lg py-4 shadow-lg">
                    <Messenger receiver_email_input={`${selectedUser.username}`}/>
                    </div>
            )}
        </div>
    );
    
    
    
    
    
};

export default Tenants;
