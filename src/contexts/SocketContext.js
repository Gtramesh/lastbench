import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
        withCredentials: true,
      });

      // Join user room
      newSocket.emit('joinUser', user.id);

      // Listen for online/offline status
      newSocket.on('userOnline', (userId) => {
        setOnlineUsers(prev => [...prev, userId]);
      });

      newSocket.on('userOffline', (userId) => {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      });

      // Listen for private messages
      newSocket.on('receivePrivateMessage', (data) => {
        // This will be handled by the chat component
        window.dispatchEvent(new CustomEvent('newMessage', { detail: data }));
      });

      // Listen for group messages
      newSocket.on('receiveGroupMessage', (data) => {
        // This will be handled by the group chat component
        window.dispatchEvent(new CustomEvent('newGroupMessage', { detail: data }));
      });

      // Listen for typing indicators
      newSocket.on('userTyping', (data) => {
        window.dispatchEvent(new CustomEvent('userTyping', { detail: data }));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const sendMessage = (receiverId, message) => {
    if (socket) {
      socket.emit('privateMessage', {
        receiverId,
        message,
        senderId: user.id
      });
    }
  };

  const sendGroupMessage = (groupId, message) => {
    if (socket) {
      socket.emit('groupMessage', {
        groupId,
        message,
        senderId: user.id
      });
    }
  };

  const sendTypingIndicator = (receiverId, isTyping) => {
    if (socket) {
      socket.emit('typing', {
        receiverId,
        isTyping
      });
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const value = {
    socket,
    onlineUsers,
    sendMessage,
    sendGroupMessage,
    sendTypingIndicator,
    isUserOnline
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
