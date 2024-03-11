import React, { useEffect, useRef, useState } from "react";
import { getResponseData } from "../ResponseHandler";

export const GroupChat = (props) => {
    const responseData = getResponseData();

    const{currentHouse} = props;
    const [room, setRoom] = useState([]);
    const [newMessage, setnewMessage] = useState("");
    const [messages, setMessages] = useState([]);


    useEffect( () =>{
      const handleRoom = async () =>{
          // e.preventDefault();
          const roomUrl = `http://localhost:8090/get-group-chat?house=${currentHouse}`;
          
          const response = await fetch(roomUrl, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          const roomData = await response.json();
          setRoom(roomData);
          
          console.log(roomData._id);
          setMessages(roomData.messages)

          // const intervalId = setInterval(() => {
          //   handleRoom();
          // }, 5000); // Fetch data every 5 seconds (adjust as needed)
      };

      handleRoom();
  }, []);
    
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage === '') return;

    try {
        const addMessageUrl = 'http://localhost:8090/add-msg';

        const response = await fetch(addMessageUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                room_id: room._id, // Assuming room._id is available in your state
                text: newMessage,
                timestamp: new Date().getTime(), // Replace this with your timestamp logic
                sender: responseData.username,
            }),
        });

        const responseDataPost = await response.json();

        if (response.ok) {
            console.log('Message added successfully:', responseData.message);
        } else {
            console.error('Error adding message:', responseData.error);
        }
    } catch (error) {
        console.error('Error adding message:', error.message);
    }

    setnewMessage('');
}


    const boxStyle = {
        width: '200px',
        alignItems: 'center',
        height: '100px',
        backgroundColor: '#e0e0e0',
        borderRadius: '10px', 
        padding: '10px',
        margin: '20px',
      };

    return( 
      
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', paddingTop: '20px' }}>
    <div>
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        House: {currentHouse}
      </h1>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {messages.map((message) => (
        <div key={message.id} style={{ marginBottom: '10px', maxWidth: '300px', textAlign: 'left' }}>
          <b style={{ marginRight: '5px', fontSize: '16px' }}>{message.sender}:</b>
          <span style={{ fontSize: '16px' }}>{message.text}</span>
        </div>
      ))}
    </div>

    <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <input
        onChange={(event) => setnewMessage(event.target.value)}
        value={newMessage}
        style={{ padding: '8px', fontSize: '16px', marginRight: '10px', width: '200px' }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 15px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Send
      </button>
    </form>
  </div>
    );
}

