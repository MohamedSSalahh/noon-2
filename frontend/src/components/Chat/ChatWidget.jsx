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
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const socketRef = useRef();
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    const [conversationId, setConversationId] = useState(null);

    // Fetch user's recent orders
    useEffect(() => {
        if (user && token) {
            const fetchOrders = async () => {
                try {
                    const res = await fetch(`${API_URL}/orders/my-orders?limit=3`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                        setOrders(data.data || []);
                    }
                } catch (err) {
                    console.error("Failed to fetch orders", err);
                }
            };
            fetchOrders();
        }
    }, [user, token]);

    // Fetch conversation ID
    useEffect(() => {
        if (user && token && adminId) {
            const initChat = async () => {
                try {
                    const res = await fetch(`${API_URL}/chat`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}` 
                        },
                        body: JSON.stringify({ receiverId: adminId })
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                        setConversationId(data.data._id);
                    }
                } catch (err) {
                    console.error("Failed to init chat", err);
                }
            };
            initChat();
        }
    }, [user, token, adminId]);

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
            socketRef.current.emit('join_chat', user._id);

            socketRef.current.on('receive_message', (message) => {
                // Adapt message format if needed
                dispatch(addMessage({ ...message, message: message.text })); 
                setIsTyping(false); 
            });

            socketRef.current.on('typing', (senderId) => {
                 if (senderId === adminId) setIsTyping(true);
            });

            socketRef.current.on('stopTyping', (senderId) => {
                 if (senderId === adminId) setIsTyping(false);
            });
            
            dispatch(fetchChatHistory(adminId));

            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [user, token, adminId, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !adminId) return;

        const tempId = Date.now().toString();
        const messageText = messageInput;
        setMessageInput(''); // Clear input immediately
        setIsTyping(false);
        if (socketRef.current) {
             socketRef.current.emit('stopTyping', { sender: user._id, receiver: adminId });
        }

        // Optimistically add
        const optimMessage = { 
            _id: tempId, 
            createdAt: new Date().toISOString(), 
            message: messageText.trim(), 
            sender: user._id 
        };
        dispatch(addMessage(optimMessage)); 

        try {
            const res = await fetch(`${API_URL}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverId: adminId,
                    text: messageText,
                    conversationId: conversationId
                })
            });
            const data = await res.json();
             // We could update the ID here if needed
        } catch (err) {
            console.error("Failed to send message", err);
            // Verify failure handling (remove optimistic message?)
        }
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
                        p: 2.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        color: 'primary.contrastText',
                        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                sx={{ 
                                    '& .MuiBadge-badge': { 
                                        bgcolor: '#D4AF37',
                                        color: '#D4AF37',
                                        boxShadow: '0 0 0 2px white',
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%'
                                    } 
                                }}
                            >
                                <Avatar sx={{ bgcolor: 'rgba(212, 175, 55, 0.2)', color: '#D4AF37', width: 44, height: 44 }}>
                                    <SupportAgentIcon />
                                </Avatar>
                            </Badge>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ fontFamily: 'Playfair Display' }}>Twill Home Support</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.85 }}>We're here to help</Typography>
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

                        {/* Recent Orders */}
                        {orders.length > 0 && (
                            <Box sx={{ my: 2 }}>
                                <Typography variant="caption" sx={{ px: 1, color: 'text.secondary', fontWeight: 600 }}>
                                    YOUR RECENT ORDERS
                                </Typography>
                                {orders.map((order) => (
                                    <Paper 
                                        key={order._id}
                                        onClick={() => setSelectedOrder(order)}
                                        sx={{ 
                                            p: 2, 
                                            mt: 1,
                                            bgcolor: selectedOrder?._id === order._id ? '#E8E6E1' : 'white',
                                            cursor: 'pointer',
                                            border: '1px solid',
                                            borderColor: selectedOrder?._id === order._id ? '#D4AF37' : 'divider',
                                            '&:hover': { borderColor: '#D4AF37' }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" fontWeight="600">
                                                Order #{order._id.slice(-6).toUpperCase()}
                                            </Typography>
                                            <Typography variant="caption" sx={{ 
                                                bgcolor: order.status === 'delivered' ? '#4caf50' : '#ff9800',
                                                color: 'white',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1
                                            }}>
                                                {order.status}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {order.items?.length || 0} items • EGP {order.totalPrice}
                                        </Typography>
                                        {order.paymentMethod && (
                                            <Typography variant="caption" sx={{ 
                                                display: 'inline-block',
                                                mt: 0.5,
                                                px: 1,
                                                py: 0.25,
                                                bgcolor: '#E8E6E1',
                                                borderRadius: 1,
                                                color: 'text.primary'
                                            }}>
                                                💳 {order.paymentMethod === 'instapay' ? 'Instapay' : 
                                                    order.paymentMethod === 'vodafone' ? 'Vodafone Cash' :
                                                    order.paymentMethod === 'fawry' ? 'Fawry' :
                                                    order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                                    order.paymentMethod}
                                            </Typography>
                                        )}
                                    </Paper>
                                ))}
                            </Box>
                        )}

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
                                        bgcolor: isMe ? '#E8E6E1' : 'primary.main',
                                        color: isMe ? 'text.primary' : 'white'
                                    }}>
                                        <Typography variant="body2">{msg.message}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
                                            <Typography variant="caption" sx={{ color: isMe ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.7)', fontSize: '0.65rem' }}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                            {isMe && <DoneAllIcon sx={{ fontSize: 14, color: '#D4AF37' }} />}
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
