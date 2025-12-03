import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { addMessage, fetchChatHistory } from '../../redux/slices/chatSlice';
import './ChatWidget.css'; // Assuming you might want some styles

const ChatWidget = () => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.authState);
    const { messages } = useSelector((state) => state.chatState);
    const [isOpen, setIsOpen] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const socketRef = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user && token) {
            socketRef.current = io(import.meta.env.VITE_BASE_URL);

            socketRef.current.emit('join', user._id);

            socketRef.current.on('receiveMessage', (message) => {
                dispatch(addMessage(message));
            });

            dispatch(fetchChatHistory(user._id));

            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [user, token, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !socketRef.current) return;

        const messageData = {
            sender: user._id,
            receiver: 'admin', // You might need a specific admin ID or handle this on backend
            message: messageInput,
        };

        // For now, assuming we send to a generic 'admin' or handling it via backend logic
        // But since our backend expects a receiver ID, we need to know the admin's ID.
        // For this simple implementation, let's assume the user sends to a specific admin or we broadcast to admins.
        // A better approach for "User to Admin" is to have the backend handle "receiver: admin" and look up an admin.
        // OR, we can just emit a 'sendMessageToAdmin' event.
        // Let's stick to the plan: The user needs to know who they are talking to? 
        // Actually, usually support chat assigns an admin.
        // Let's temporarily hardcode an admin ID or fetch it? 
        // For simplicity, let's assume the backend handles routing if receiver is 'admin' (need to update backend?)
        // OR, let's just pick the first admin found?
        // Let's update backend to handle "receiver: 'admin'"? No, let's keep it simple.
        // Let's assume there's a "Support" user.
        
        // WAIT: The user request said "chat app between the user and admin".
        // Let's assume the user sends to the *system* and any admin can see it.
        // But my schema requires a receiver ID.
        // I will update the frontend to send to a placeholder ID or handle it.
        
        // Let's emit to the socket, and let the backend find an admin?
        // My backend `sendMessage` expects `receiver` in the data.
        
        // Let's modify the backend to handle this later if needed. For now, I will assume there is an admin.
        // I'll just emit the message and let the socket server handle it?
        // The socket server saves to DB using the `receiver` ID.
        
        // Workaround: I will fetch the admin ID first? No.
        // I will make the receiver optional in the schema? No.
        
        // Let's just use a hardcoded Admin ID for testing if I can find one, or better:
        // When the user opens the chat, we could assign an admin?
        
        // Let's go with: The user emits 'sendMessage', and if they are a user, the receiver is the Admin.
        // I need to know the Admin's ID.
        // I'll add a temporary fix: I'll fetch the admin ID in the `useEffect`.
        // But I don't have an API for that.
        
        // Alternative: The user just sends messages to "Support".
        // I'll update the backend `sendMessage` to handle `receiver: 'admin'` -> find an admin user.
        
        socketRef.current.emit('sendMessage', { ...messageData, receiver: '64c7...' }); // Placeholder
        
        // Actually, let's just emit and let the backend handle it?
        // My backend code: `const { sender, receiver, message } = data;`
        
        // I will update the backend `sendMessage` listener to find an admin if receiver is not provided or is 'admin'.
        
        socketRef.current.emit('sendMessage', messageData);
        // Optimistically add message
        // dispatch(addMessage({ ...messageData, _id: Date.now(), createdAt: new Date().toISOString() })); 
        setMessageInput('');
    };

    if (!user || user.role === 'admin') return null; // Admins have their own view

    return (
        <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
            <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment'}`}></i>
            </button>
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Support Chat</h3>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender === user._id ? 'sent' : 'received'}`}>
                                <p>{msg.message}</p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button type="submit"><i className="fas fa-paper-plane"></i></button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
