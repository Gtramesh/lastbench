import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon,
  FaceSmileIcon,
  PaperClipIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import EmojiPicker from 'emoji-picker-react';
import FileUpload from '../components/FileUpload';
import axios from 'axios';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { sendMessage, sendTypingIndicator, isUserOnline } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    // Listen for new messages
    const handleNewMessage = (event) => {
      const data = event.detail;
      if ((data.senderId === userId && data.receiverId === user.id) ||
          (data.senderId === user.id && data.receiverId === userId)) {
        setMessages(prev => [...prev, {
          _id: Date.now().toString(),
          senderId: { _id: data.senderId },
          message: data.message,
          timestamp: data.timestamp,
          messageType: 'text'
        }]);
      }
    };

    // Listen for typing indicators
    const handleUserTyping = (event) => {
      const data = event.detail;
      if (data.userId === userId) {
        setOtherUserTyping(data.isTyping);
      }
    };

    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('userTyping', handleUserTyping);

    return () => {
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('userTyping', handleUserTyping);
    };
  }, [userId, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when user opens chat
    if (userId) {
      axios.put(`/api/chat/read/${userId}`);
    }
  }, [userId]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`/api/chat/history/${userId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`/api/user/all`);
      const user = response.data.find(u => u.id === userId);
      setOtherUser(user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    try {
      // Send via API to save to database
      const response = await axios.post('/api/chat/send', {
        receiverId: userId,
        message: messageText
      });

      // Send via socket for real-time
      sendMessage(userId, messageText);

      // Add message to local state
      setMessages(prev => [...prev, response.data.data]);
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSendingMessage(false);
      inputRef.current?.focus();
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(userId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(userId, false);
    }, 1000);
  };

  const handleFileUpload = (fileData) => {
    // Send file message
    sendFileMessage(fileData);
  };

  const sendFileMessage = async (fileData) => {
    try {
      const response = await axios.post('/api/chat/send', {
        receiverId: userId,
        message: fileData.fileName,
        messageType: 'file',
        fileUrl: fileData.fileUrl,
        fileName: fileData.fileName,
        fileSize: fileData.fileSize
      });

      // Send via socket for real-time
      sendMessage(userId, `📎 ${fileData.fileName}`);

      // Add message to local state
      setMessages(prev => [...prev, response.data.data]);
    } catch (error) {
      console.error('Error sending file message:', error);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const renderMessageContent = (message) => {
    if (message.messageType === 'file') {
      return (
        <div className="flex items-center space-x-2">
          <PaperClipIcon className="w-4 h-4" />
          <a 
            href={message.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {message.fileName}
          </a>
          <span className="text-xs opacity-70">
            ({(message.fileSize / 1024).toFixed(1)} KB)
          </span>
        </div>
      );
    }
    return <p className="text-sm">{message.message}</p>;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-3">
            <ArrowLeftIcon className="w-6 h-6 text-gray-600 hover:text-gray-900" />
          </Link>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
              {otherUser?.username?.charAt(0).toUpperCase()}
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isUserOnline(userId) ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              {isUserOnline(userId) && (
                <div className="w-full h-full rounded-full bg-green-500 animate-pulse"></div>
              )}
            </div>
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{otherUser?.username}</h3>
            <p className="text-sm text-gray-500">
              {isUserOnline(userId) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isSent = message.senderId._id === user.id;
              const showDate = index === 0 || 
                new Date(message.createdAt).toDateString() !== 
                new Date(messages[index - 1].createdAt).toDateString();

              return (
                <div key={message._id}>
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4 message-new`}>
                    <div className={`message-bubble ${isSent ? 'message-sent' : 'message-received'}`}>
                      {renderMessageContent(message)}
                      <p className={`text-xs mt-1 ${isSent ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp || message.createdAt)}
                        {isSent && ' ✓'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {otherUserTyping && (
              <div className="flex justify-start mb-4">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <div className="relative">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaceSmileIcon className="w-5 h-5 text-gray-600" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-10">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
          
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FileUpload onFileUpload={handleFileUpload} />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={sendingMessage}
          />
          
          <button
            type="submit"
            disabled={!newMessage.trim() || sendingMessage}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingMessage ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
