import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { addMessage, fetchChatHistory } from '../../redux/slices/chatSlice';
import './AdminChat.css';

const AdminChat = () => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.authState);
    const { messages } = useSelector((state) => state.chatState);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [activeUsers, setActiveUsers] = useState([]); // List of users to chat with
    const socketRef = useRef();
    const messagesEndRef = useRef(null);

    // Fetch list of users who have chatted? 
    // For now, let's mock or fetch all users? 
    // Ideally we need an API `getUsersWithChat`.
    // I'll add a simple list for now or just rely on incoming messages to populate the list?
    
    useEffect(() => {
        if (user && token && user.role === 'admin') {
            socketRef.current = io(import.meta.env.VITE_BASE_URL);
            socketRef.current.emit('join', user._id);

            socketRef.current.on('receiveMessage', (message) => {
                dispatch(addMessage(message));
                // Add sender to active users if not present
                setActiveUsers(prev => {
                    if (!prev.find(u => u._id === message.sender)) {
                        return [...prev, { _id: message.sender, name: 'User ' + message.sender }]; 
                    }
                    return prev;
                });
            });

            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [user, token, dispatch]);

    useEffect(() => {
        if (selectedUser) {
            dispatch(fetchChatHistory(selectedUser._id));
        }
    }, [selectedUser, dispatch]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedUser) return;

        const messageData = {
            sender: user._id,
            receiver: selectedUser._id,
            message: messageInput,
        };

        socketRef.current.emit('sendMessage', messageData);
        dispatch(addMessage({ ...messageData, createdAt: new Date().toISOString() }));
        setMessageInput('');
    };

    return (
        <div className="admin-chat-container">
            <div className="user-list">
                <h3>Active Chats</h3>
                {activeUsers.map(u => (
                    <div key={u._id} onClick={() => setSelectedUser(u)} className={`user-item ${selectedUser?._id === u._id ? 'active' : ''}`}>
                        {u.name}
                    </div>
                ))}
            </div>
            <div className="chat-area">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <h3>Chat with {selectedUser.name}</h3>
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
                            <button type="submit">Send</button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">Select a user to chat</div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
