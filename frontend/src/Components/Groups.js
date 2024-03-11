import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import Messenger from './Messenger';
import Payment from './payment';
import PendingRequests from './GroupRequests';
import { getResponseData } from '../ResponseHandler';
import GroupMessaging from './GroupMessaging';

const UserTable = () => {
    const responseData = getResponseData();
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showMessenger, setShowMessenger] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showGroupMessaging, setShowGroupMessaging] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState(null);

    useEffect(() => {
        const handleGroup = async () => {
            if (!responseData.housing_group) {
                setIsLoading(false); // Set loading to false if there are no housing groups
                return;
            }
            const groupUrl = `http://localhost:8090/tenant-home?housing_group=${encodeURIComponent(responseData.housing_group)}`;
            const response = await fetch(groupUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const groupData = await response.json();
            setUsers(groupData);
            const filteredUsers = groupData.filter(user => user.username !== responseData.username);
            setUsers(filteredUsers);
            setIsLoading(false); // Set loading to false after data is fetched
        };

        handleGroup();
    }, [responseData.housing_group]);

    const handleMessageClick = (user) => {
        setShowMessenger(!showMessenger);
        setSelectedUser(user)
        console.log(user);
    };

    const handlePaymentButtonClick = (user, event) => {
        event.preventDefault();
        window.open(user.payment_info, '_blank');
    };

    const handleGroupMessageClick = (house) => {
        setShowGroupMessaging(!showGroupMessaging);
        setSelectedHouse(house);
        console.log("Housing Info",selectedHouse);
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
                    <PendingRequests/>
                </div>
            </div>
        </div>
        
        )
    }

    return (
        <div className="container mx-auto px-2 py-8 flex">
            <div className="w-half max-w-98 px-10 bg-white rounded-lg py-4 shadow-lg" >
                <div className="max-w-98 px-10">
                    <div className="mb-4">
                        <h1 className="text-xl font-bold">{responseData.housing_group}
                        <button
                            className="flex px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                            onClick={() => handleGroupMessageClick(responseData.housing_group)}
                        >
                            <FontAwesomeIcon icon={faComment} className="mr-1" />
                            Message Group
                        </button>
                        </h1>
                        <h1 className="text-xl font-bold">My Housing Group</h1>
                    </div>
                </div>
                <ul role="list" className="ml-0">
                    {users.map((user, index) => (
                        <li key={index} className={`flex justify-between gap-x-6 py-5 pl-4 pr-4`}>
                            <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auto">
                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.first_name + " " + user.last_name}</p>
                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.phone_number}</p>
                                </div>
                            </div>
                            <div className="flex gap-x-2">
                                <button
                                    className="flex items-center justify-center px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                                    onClick={() => handleMessageClick(user)}
                                >
                                    <FontAwesomeIcon icon={faComment} className="mr-1" />
                                    Message
                                </button>
                                <button
                                    className="flex items-center justify-center px-6 py-1 bg-green-500 text-white rounded-md"
                                    onClick={(event) => handlePaymentButtonClick(user, event)}
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
                    <Messenger receiver_email_input={`${selectedUser.username}`}/>
                    </div>
                )}
                {showGroupMessaging && (
                    <div className="w-half max-w-98 px-10 bg-white rounded-lg py-4 shadow-lg">
                        <GroupMessaging selectedHouse={selectedHouse} />
                    </div>
                )}
        </div>
    );
};

export default UserTable;
