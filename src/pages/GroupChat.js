import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon,
  FaceSmileIcon,
  PaperClipIcon,
  UserGroupIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';

const GroupChat = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { sendGroupMessage } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchGroupDetails();
    fetchGroupMessages();
  }, [groupId]);

  useEffect(() => {
    // Listen for new group messages
    const handleNewGroupMessage = (event) => {
      const data = event.detail;
      if (data.groupId === groupId) {
        setMessages(prev => [...prev, {
          _id: Date.now().toString(),
          senderId: { _id: data.senderId },
          message: data.message,
          timestamp: data.timestamp,
          messageType: 'text'
        }]);
      }
    };

    window.addEventListener('newGroupMessage', handleNewGroupMessage);

    return () => {
      window.removeEventListener('newGroupMessage', handleNewGroupMessage);
    };
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.get(`/api/group/${groupId}`);
      setGroup(response.data.group);
    } catch (error) {
      console.error('Error fetching group details:', error);
    }
  };

  const fetchGroupMessages = async () => {
    try {
      const response = await axios.get(`/api/group/${groupId}/messages`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching group messages:', error);
    } finally {
      setLoading(false);
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
      const response = await axios.post(`/api/group/${groupId}/message`, {
        message: messageText
      });

      // Send via socket for real-time
      sendGroupMessage(groupId, messageText);

      // Add message to local state
      setMessages(prev => [...prev, response.data.data]);
    } catch (error) {
      console.error('Error sending group message:', error);
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSendingMessage(false);
      inputRef.current?.focus();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  const isCurrentUserAdmin = () => {
    if (!group) return false;
    const member = group.members.find(m => m.userId._id === user.id);
    return member && (member.role === 'admin' || group.createdBy._id === user.id);
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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white">
            <UserGroupIcon className="w-6 h-6" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{group?.groupName}</h3>
            <p className="text-sm text-gray-500">
              {group?.members?.length || 0} members
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <UserGroupIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Members Sidebar */}
      {showMembers && (
        <div className="w-64 border-r border-gray-200 bg-white p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Group Members</h4>
          <div className="space-y-3">
            {group?.members?.map((member) => (
              <div key={member.userId._id} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                  {member.userId.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-2 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {member.userId.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {member.role === 'admin' ? 'Admin' : 'Member'}
                  </p>
                </div>
                {member.userId._id === user.id && (
                  <span className="text-xs text-primary-600 font-medium">You</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className={`chat-messages custom-scrollbar ${showMembers ? 'mr-64' : ''}`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserGroupIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p>No messages in this group yet</p>
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
                    <div className={`max-w-xs lg:max-w-md`}>
                      {!isSent && (
                        <p className="text-xs text-gray-500 mb-1">
                          {message.senderId.username}
                        </p>
                      )}
                      <div className={`message-bubble ${isSent ? 'message-sent' : 'message-received'}`}>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${isSent ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp || message.createdAt)}
                          {isSent && ' ✓'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
            <PaperClipIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${group?.groupName}...`}
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

export default GroupChat;
