import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
//import userData from './people.json';
import Messenger from './Messenger';
import Payment from './payment';
import { getResponseData } from '../ResponseHandler';

const UserTable = () => {
    const responseData = getResponseData();
    console.log(responseData.additional_fields.housing_group);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showMessenger, setShowMessenger] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect( () =>{
        const handleGroup = async () =>{
            // e.preventDefault();
            const groupUrl = `http://localhost:8090/tenant-home?housing_group=${encodeURIComponent(responseData.additional_fields.housing_group)}`;
            
            const response = await fetch(groupUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const groupData = await response.json();
            setUsers(groupData);
            
            console.log(groupData);
        };

        handleGroup();
    }, []); 
    const handleMessageClick = (user) => {
        setShowMessenger(!showMessenger);
        setSelectedUser(user)
    };
    const handlePaymentButtonClick = () => {
        setShowPaymentForm(!showPaymentForm);
    };



    return (
        <div className="container mx-auto px-2 py-8 flex">
            <div className="w-half max-w-98 px-10 bg-white rounded-lg py-4 shadow-lg">
                <div className="max-w-98 px-10">
                <div className="mb-4">
                    <h1 className="text-xl font-bold">My Housing Group</h1>
                </div>
                </div>
                <ul role="list" className="ml-0">
                    {users.map((user, index) => (
                        <li key={index} className={`flex justify-between gap-x-6 py-5 pl-4 pr-4`}>
                            <div className="flex min-w-0 gap-x-4">
                                {/* Profile Image */}
                                {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={user.imageUrl} alt="" /> */}
                                <div className="min-w-0 flex-auto">
                                    {/* <p className="text-sm font-semibold leading-6 text-gray-900">{user.name}</p> */}
                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.first_name + " " + user.last_name}</p>
                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.phone_number}</p>
                                </div>
                            </div>
                            <div className="flex gap-x-2">
                                {/* Action Buttons */}
                                <button
                                    className="flex items-center justify-center px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                                    onClick={() => handleMessageClick(user)} // Example action
                                >
                                    <FontAwesomeIcon icon={faComment} className="mr-1" />
                                    Message
                                </button>
                                <button
                                    className="flex items-center justify-center px-6 py-1 bg-green-500 text-white rounded-md"
                                    onClick={handlePaymentButtonClick}
                                >
                                    <FontAwesomeIcon icon={faMoneyBill} className="mr-1" />
                                    Pay
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                </div>
                {/* Payment Form */}
                {showPaymentForm && (
                    
                    <div  className="w-half max-w-98 px-10 bg-white rounded-lg py-4 shadow-lg">
                        <h2 className="text-xl font-bold mb-2">Payment Form</h2>
                            <Payment/>
                        {/* <form>
                            <label htmlFor="paymentAmount">Payment Amount:</label>
                            <input type="text" id="paymentAmount" name="paymentAmount" />
                            <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">Submit Payment</button>
                        </form> */}
                    </div>
                    )
                }
                {showMessenger && (
                    <div  className="w-half max-w-98 px-10 bg-white rounded-lg py-4 shadow-lg">
                    <Messenger initialRoom={`${selectedUser.first_name} ${selectedUser.last_name}`}/>
                    </div>
                )}
        </div>
    );
};

export default UserTable;
