import React, { useRef, useState } from "react";
import { getResponseData } from "../ResponseHandler";

// import {Auth} from './Auth'
import { Chat } from "./Chat";



function Messenger({receiver_email_input}) {

  console.log("Printing Response Data " + getResponseData());


  const [receiver_email, setRoom] = useState(receiver_email_input);
  console.log("Email Address: " + receiver_email)
  const roomInputRef = useRef(null);


  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', paddingTop: '50px' }}>
      {receiver_email ? (
        <Chat receiver_email={receiver_email} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ marginBottom: '10px', fontSize: '18px' }}>Enter Person Name:</label>
          <input
            ref={roomInputRef}
            style={{ padding: '8px', fontSize: '16px', marginBottom: '20px', width: '200px' }}
          />
          <button
            onClick={() => setRoom(roomInputRef.current.value)}
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
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default Messenger;

