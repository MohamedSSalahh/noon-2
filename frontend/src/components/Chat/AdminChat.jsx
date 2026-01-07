import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SOCKET_URL } from '../../utils/apiConfig';
import io from 'socket.io-client';
import { addMessage, fetchChatHistory, fetchChatUsers } from '../../redux/slices/chatSlice';
import AdminLayout from '../Admin/AdminLayout';
import { Box, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, TextField, IconButton, Badge, Divider, InputBase } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';

const AdminChat = () => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.authState);
    const { messages } = useSelector((state) => state.chatState);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { users: chatUsers } = useSelector((state) => state.chatState); 
    const socketRef = useRef();
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const selectedUserRef = useRef(null);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);
    
    useEffect(() => {
        if (user && user.role === 'admin') {
            dispatch(fetchChatUsers()); 

            socketRef.current = io(SOCKET_URL);
            socketRef.current.emit('join', user._id);

            socketRef.current.on('receiveMessage', (message) => {
                dispatch(addMessage(message));
            });

            socketRef.current.on('typing', (senderId) => {
                if (selectedUserRef.current && senderId === selectedUserRef.current._id) {
                    setIsTyping(true);
                }
            });

            socketRef.current.on('stopTyping', (senderId) => {
                if (selectedUserRef.current && senderId === selectedUserRef.current._id) {
                    setIsTyping(false);
                }
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedUser]);

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
        <AdminLayout>
            <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', gap: 2 }}>
                
                {/* Users List */}
                <Paper sx={{ width: 320, display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight="bold">Messages</Typography>
                        <Paper component="form" sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', mt: 2, borderRadius: 2, bgcolor: 'action.hover', boxShadow: 'none' }}>
                            <SearchIcon sx={{ color: 'text.secondary' }} />
                            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search chats..." />
                        </Paper>
                    </Box>
                    <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                        {chatUsers.length === 0 ? (
                            <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>No active chats</Typography>
                        ) : (
                            chatUsers.map(u => (
                                <React.Fragment key={u._id}>
                                    <ListItem 
                                        button 
                                        selected={selectedUser?._id === u._id}
                                        onClick={() => setSelectedUser(u)}
                                        sx={{ 
                                            py: 1.5,
                                            '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.light' } },
                                            '&.Mui-selected .MuiTypography-root': { color: 'primary.contrastText' },
                                            '&.Mui-selected .MuiTypography-caption': { color: 'rgba(255,255,255,0.7)' }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={u.profileImg}>{!u.profileImg && u.name.charAt(0)}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={u.name} 
                                            secondary={u.email} 
                                            primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                                            secondaryTypographyProps={{ noWrap: true }}
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </Paper>

                {/* Chat Area */}
                <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Badge variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                                    <Avatar src={selectedUser.profileImg} sx={{ width: 48, height: 48 }}>{!selectedUser.profileImg && selectedUser.name.charAt(0)}</Avatar>
                                </Badge>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">{selectedUser.name}</Typography>
                                    <Typography variant="caption" color={isTyping ? 'primary' : 'text.secondary'} fontWeight={isTyping ? 700 : 400}>
                                        {isTyping ? 'Typing...' : 'Online'}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Messages */}
                            <Box sx={{ flex: 1, p: 3, overflowY: 'auto', bgcolor: '#F5F7FA', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {messages.map((msg, index) => {
                                    const isMe = msg.sender === user._id;
                                    return (
                                        <Box key={index} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                                            <Paper 
                                                elevation={0}
                                                sx={{ 
                                                    p: 2, 
                                                    maxWidth: '70%', 
                                                    borderRadius: 2, 
                                                    borderTopRightRadius: isMe ? 0 : 8,
                                                    borderTopLeftRadius: isMe ? 8 : 0,
                                                    bgcolor: isMe ? 'primary.main' : 'white',
                                                    color: isMe ? 'primary.contrastText' : 'text.primary',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                <Typography variant="body2">{msg.message}</Typography>
                                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'right', opacity: 0.8, fontSize: '0.65rem' }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Input */}
                            <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
                                <TextField 
                                    fullWidth 
                                    placeholder="Type a message..." 
                                    variant="outlined" 
                                    size="small"
                                    value={messageInput}
                                    onChange={(e) => {
                                        setMessageInput(e.target.value);
                                        if (!socketRef.current || !selectedUser) return;
                                        if (!typingTimeoutRef.current) socketRef.current.emit('typing', { sender: user._id, receiver: selectedUser._id });
                                        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                                        typingTimeoutRef.current = setTimeout(() => {
                                            socketRef.current.emit('stopTyping', { sender: user._id, receiver: selectedUser._id });
                                            typingTimeoutRef.current = null;
                                        }, 2000);
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                                <IconButton 
                                    type="submit" 
                                    disabled={!messageInput.trim()} 
                                    color="primary" 
                                    sx={{ 
                                        bgcolor: 'primary.main', 
                                        color: 'primary.contrastText', 
                                        width: 48, 
                                        height: 48, 
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
                                    }}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                             <Box sx={{ width: 80, height: 80, bgcolor: 'action.hover', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                 <SendIcon sx={{ fontSize: 40, opacity: 0.5 }} />
                             </Box>
                             <Typography variant="h6">Select a conversation</Typography>
                             <Typography variant="body2">Choose a user from the list to start chatting</Typography>
                        </Box>
                    )}
                </Paper>
            </Box>
        </AdminLayout>
    );
};

export default AdminChat;
