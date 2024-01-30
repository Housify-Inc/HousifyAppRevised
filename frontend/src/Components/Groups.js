import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import userData from './people.json';
import Messenger from './Messenger';

const UserTable = () => {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showMessenger, setShowMessenger] = useState(false);

    const handleMessageClick = () => {
        setShowMessenger(!showMessenger);
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
                    {userData.map((user, index) => (
                        <li key={index} className={`flex justify-between gap-x-6 py-5 pl-4 pr-4`}>
                            <div className="flex min-w-0 gap-x-4">
                                {/* Profile Image */}
                                <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={user.imageUrl} alt="" />
                                <div className="min-w-0 flex-auto">
                                    <p className="text-sm font-semibold leading-6 text-gray-900">{user.name}</p>
                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-x-2">
                                {/* Action Buttons */}
                                <button
                                    className="flex items-center justify-center px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                                    onClick={handleMessageClick} // Example action
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
                    <div className="bg-gray-200 p-4 mt-4 float-right">
                        <h2 className="text-xl font-bold mb-2">Payment Form</h2>
                        <form>
                            <label htmlFor="paymentAmount">Payment Amount:</label>
                            <input type="text" id="paymentAmount" name="paymentAmount" />
                            <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">Submit Payment</button>
                        </form>
                    </div>
                )}
                {showMessenger && <Messenger/>}
        </div>
    );
};

export default UserTable;
