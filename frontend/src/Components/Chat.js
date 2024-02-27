import React, { useState, useRef, useEffect } from "react"
import { addDoc, serverTimestamp, collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { getResponseData } from "./ResponseHandler";


export const Chat = (props) => {
    const responseData = getResponseData();

    const{room} = props;

    const [newMessage, setnewMessage] = useState("");
    const [messages, setMessages] = useState([]);


    const messagesRef = collection(db, 'messages');


    useEffect(() => {
        const queryMessages = query(messagesRef, where('room', '==', room), orderBy("createdAt"))
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = []
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id})
            });
            setMessages(messages);
        });

        return () => unsubscribe();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newMessage === '') return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: responseData.first_name + ' ' + responseData.last_name,
            room,
        });

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
        Person: {room}
      </h1>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {messages.map((message) => (
        <div key={message.id} style={{ marginBottom: '10px', maxWidth: '300px', textAlign: 'left' }}>
          <b style={{ marginRight: '5px', fontSize: '16px' }}>{message.user}:</b>
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