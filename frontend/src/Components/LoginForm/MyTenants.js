import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import Messenger from '../MessagingComponents/Messenger';
import { getResponseData } from '../../ResponseHandler';
import GroupMessaging from '../MessagingComponents/GroupMessaging';
import { Spinner } from 'react-bootstrap';

const Tenants = () => {
    const responseData = getResponseData();
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showMessenger, setShowMessenger] = useState(false);
    const [users, setUsers] = useState([]);
    const [noUsers, setnoUsers] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showGroupMessaging, setShowGroupMessaging] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState(null);

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
            const filteredArray = groupDataArray.map(subArray =>
                subArray.filter(user => user.username !== responseData.username)
            );
            setUsers(filteredArray);
            if(users.length === 0){
                setnoUsers(true);
            }
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

    const handleGroupMessageClick = (house) => {
        setShowGroupMessaging(!showGroupMessaging);
        setSelectedHouse(house);
        console.log("Housing Info",selectedHouse);
    };

    const handleKickButtonClick = async (user) => {
        const leaveGroupURL = 'http://localhost:8090/remove_user_from_group';

        const response = await fetch(leaveGroupURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username
            }),
        });
        
        const responseDataPost = await response.json();
        
        if (response.ok) {
            const updatedUsers = users.map(userOrArray =>
                Array.isArray(userOrArray)
                    ? userOrArray.filter(person => person.username !== user.username)
                    : userOrArray
            );
            // Update the state with the filtered array
            setUsers(updatedUsers);
            console.log('Message added successfully:', responseDataPost.message);
        } else {
            console.error('Error adding message:', responseDataPost.error);
        }
    };


    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status" style={{ color: 'white' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }


    if (noUsers) {
        return(
        <div className="flex justify-center items-start h-screen">
            <div className="max-w-98 px-10">
                <div className="mb-4">
                    <h1 className="text-4xl font-bold text-slate-100">You do not have any Tenants</h1>
                </div>
            </div>
        </div>
        
        )
    }

    return (
        <div className="container mx-auto px-2 py-8 flex mb-4">
            {users.map((userOrArray, index) => (
                // Check if userOrArray is empty or undefined
                userOrArray && userOrArray.length > 0 && (
                    <div key={index} className="w-half max-w-98 px-10 bg-white rounded-lg py-4 shadow-lg mb-4">
                        <div className="max-w-98 px-10 mb-4">
                            <div className="mb-4 flex items-center">
                                {Array.isArray(userOrArray) ? (
                                    userOrArray.length > 0 && userOrArray[0].housing_group && (
                                        <h1 className="text-xl font-bold flex items-center">
                                            {userOrArray[0].housing_group}
                                            <button
                                                className="flex px-2 py-1 bg-blue-500 text-white rounded-md ml-2"
                                                onClick={() => handleGroupMessageClick(userOrArray[0].housing_group)}
                                            >
                                                <FontAwesomeIcon icon={faComment} className="mr-1" />
                                                Message Group
                                            </button>
                                        </h1>
                                        
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
                                        <button
                                        className="flex items-center justify-center px-6 py-1 bg-red-500 text-white rounded-md"
                                        onClick={() => handleKickButtonClick(person)}
                                        >
                                            Kick
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
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

export default Tenants;
