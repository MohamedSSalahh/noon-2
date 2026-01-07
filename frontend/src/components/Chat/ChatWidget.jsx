import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { addMessage, fetchChatHistory } from '../../redux/slices/chatSlice';
import { SOCKET_URL } from '../../utils/apiConfig';
import API_URL from '../../utils/apiConfig';
import { Box, IconButton, Paper, Typography, TextField, Avatar, Fab, Badge, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const ChatWidget = () => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.authState);
    const { messages } = useSelector((state) => state.chatState);
    const [isOpen, setIsOpen] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [adminId, setAdminId] = useState(null);
    const socketRef = useRef();
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    // Fetch Real Admin ID on mount
    useEffect(() => {
        if (user && token) {
            const getAdmin = async () => {
                try {
                    const res = await fetch(`${API_URL}/users/admin-id`, {
                         headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                        setAdminId(data.data);
                    }
                } catch (err) {
                    console.error("Failed to get admin ID", err);
                }
            };
            getAdmin();
        }
    }, [user, token]);

    useEffect(() => {
        if (user && token && adminId) {
            socketRef.current = io(SOCKET_URL);
            socketRef.current.emit('join', user._id);

            socketRef.current.on('receiveMessage', (message) => {
                dispatch(addMessage(message));
                setIsTyping(false); // Stop typing if message received
            });

            socketRef.current.on('typing', (senderId) => {
                 if (senderId === adminId) setIsTyping(true);
            });

            socketRef.current.on('stopTyping', (senderId) => {
                 if (senderId === adminId) setIsTyping(false);
            });
            
            // Pass adminId to fetch history between USER and ADMIN
            dispatch(fetchChatHistory(adminId));

            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [user, token, adminId, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !socketRef.current || !adminId) return;

        const messageData = {
            sender: user._id,
            receiver: adminId, 
            message: messageInput,
        };

        socketRef.current.emit('sendMessage', messageData);
        // Optimistically add
        dispatch(addMessage({ ...messageData, _id: Date.now().toString(), createdAt: new Date().toISOString() })); 
        setMessageInput('');
    };

    if (!user || user.role === 'admin') return null;

    return (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
            {/* Chat Toggle Button */}
            <Fab 
                color="primary" 
                aria-label="chat"
                onClick={() => setIsOpen(!isOpen)}
                sx={{ 
                    width: 64, 
                    height: 64, 
                    boxShadow: 6,
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                }}
            >
                {isOpen ? <CloseIcon sx={{ fontSize: 32 }} /> : <ChatIcon sx={{ fontSize: 32 }} />}
            </Fab>

            {/* Chat Window */}
            {isOpen && (
                <Paper 
                    elevation={12}
                    sx={{ 
                        position: 'absolute', 
                        bottom: 80, 
                        right: 0, 
                        width: 380, 
                        height: 600, 
                        maxHeight: '80vh',
                        display: 'flex', 
                        flexDirection: 'column', 
                        borderRadius: 4, 
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ 
                        bgcolor: 'primary.main', 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        color: 'primary.contrastText'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                sx={{ 
                                    '& .MuiBadge-badge': { 
                                        bgcolor: 'success.main',
                                        color: 'success.main',
                                        boxShadow: '0 0 0 2px white',
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%'
                                    } 
                                }}
                            >
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }}>
                                    <SupportAgentIcon />
                                </Avatar>
                            </Badge>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">Noon Support</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>Relies in minutes</Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'inherit' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Messages Area */}
                    <Box sx={{ 
                        flex: 1, 
                        p: 2, 
                        overflowY: 'auto', 
                        bgcolor: '#ECE5DD', // WhatsApp-like background or theme grey
                        backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                    }}>
                        {/* Welcome Message */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Paper sx={{ 
                                p: 1.5, 
                                px: 2, 
                                borderRadius: 2, 
                                borderTopLeftRadius: 0,
                                maxWidth: '85%',
                                bgcolor: 'white'
                            }}>
                                <Typography variant="body2" color="text.primary">
                                    👋 Hello {user.name.split(' ')[0]}! How can we help you today?
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" textAlign="right" sx={{ mt: 0.5 }}>
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Paper>
                        </Box>

                        {messages.map((msg, index) => {
                            const isMe = msg.sender === user._id;
                            return (
                                <Box key={index} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                                    <Paper sx={{ 
                                        p: 1.5, 
                                        px: 2, 
                                        borderRadius: 2, 
                                        borderTopRightRadius: isMe ? 0 : 8,
                                        borderTopLeftRadius: isMe ? 8 : 0,
                                        maxWidth: '85%',
                                        bgcolor: isMe ? '#d9fdd3' : 'white', // WhatsApp green for sent
                                        color: 'text.primary'
                                    }}>
                                        <Typography variant="body2">{msg.message}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
                                            <Typography variant="caption" sx={{ color: isMe ? 'rgba(0,0,0,0.45)' : 'text.secondary', fontSize: '0.65rem' }}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                            {isMe && <DoneAllIcon sx={{ fontSize: 14, color: 'info.main' }} />}
                                        </Box>
                                    </Paper>
                                </Box>
                            );
                        })}
                        
                        {isTyping && (
                             <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Paper sx={{ p: 1.5, borderRadius: 2, borderTopLeftRadius: 0, bgcolor: 'white' }}>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <Box sx={{ width: 6, height: 6, bgcolor: 'text.secondary', borderRadius: '50%', animation: 'bounce 1s infinite', animationDelay: '0s' }} />
                                        <Box sx={{ width: 6, height: 6, bgcolor: 'text.secondary', borderRadius: '50%', animation: 'bounce 1s infinite', animationDelay: '0.2s' }} />
                                        <Box sx={{ width: 6, height: 6, bgcolor: 'text.secondary', borderRadius: '50%', animation: 'bounce 1s infinite', animationDelay: '0.4s' }} />
                                        <style>{`
                                            @keyframes bounce {
                                                0%, 100% { transform: translateY(0); }
                                                50% { transform: translateY(-4px); }
                                            }
                                        `}</style>
                                    </Box>
                                </Paper>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Box 
                        component="form" 
                        onSubmit={handleSendMessage}
                        sx={{ 
                            p: 2, 
                            bgcolor: 'background.default', 
                            borderTop: 1, 
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <AttachFileIcon />
                        </IconButton>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => {
                                setMessageInput(e.target.value);
                                if (!socketRef.current || !adminId) return;

                                if (!typingTimeoutRef.current) {
                                    socketRef.current.emit('typing', { sender: user._id, receiver: adminId });
                                }
                                
                                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

                                typingTimeoutRef.current = setTimeout(() => {
                                    socketRef.current.emit('stopTyping', { sender: user._id, receiver: adminId });
                                    typingTimeoutRef.current = null;
                                }, 2000);
                            }}
                            sx={{ 
                                '& .MuiOutlinedInput-root': { 
                                    bgcolor: 'white', 
                                    borderRadius: 4 
                                } 
                            }}
                        />
                         {messageInput.trim() ? (
                             <IconButton type="submit" color="primary" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
                                <SendIcon />
                             </IconButton>
                         ) : (
                             <IconButton sx={{ color: 'text.secondary' }}>
                                <MicIcon />
                             </IconButton>
                         )}
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default ChatWidget;
