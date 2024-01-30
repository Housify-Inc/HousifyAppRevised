import React, { useState } from 'react';

const Messenger = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (inputMessage.trim() !== '') {
            setMessages([...messages, { text: inputMessage, sender: 'user' }]);
            setInputMessage('');
        }
    };

    return (
        <div className="bg-gray-200 p-4 mt-4 float-right">
        <div className="messenger">
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
        </div>
    );
};

export default Messenger;
