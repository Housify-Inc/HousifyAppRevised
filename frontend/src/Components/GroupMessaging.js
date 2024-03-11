// GroupMessaging.js
import React, { useRef, useState } from "react";
import { getResponseData } from "../ResponseHandler";

// import {Auth} from './Auth'
import { Chat } from "./Chat";
import { GroupChat } from "./GroupChat";

const GroupMessaging = ({selectedHouse}) => {
  // Your group messaging component logic goes here
  const [currentHouse, setHouse] = useState(selectedHouse);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', paddingTop: '50px' }}>
      {currentHouse ? (
        <GroupChat currentHouse={currentHouse} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ marginBottom: '10px', fontSize: '18px' }}>Enter Person Name:</label>
          <input
            ref={currentHouse}
            style={{ padding: '8px', fontSize: '16px', marginBottom: '20px', width: '200px' }}
          />
          <button
            onClick={() => setHouse(currentHouse.current.value)}
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
};

export default GroupMessaging;
