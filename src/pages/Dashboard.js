import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  UserPlusIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { onlineUsers, isUserOnline } = useSocket();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chats');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, groupsRes, conversationsRes] = await Promise.all([
        axios.get('/api/user/all'),
        axios.get('/api/group/my-groups'),
        axios.get('/api/chat/conversations')
      ]);

      setUsers(usersRes.data);
      setGroups(groupsRes.data.groups || []);
      setConversations(conversationsRes.data.conversations || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(userItem => 
    userItem.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    userItem.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const UserListItem = ({ userItem, showLastMessage = false, lastMessage = null }) => (
    <Link
      to={`/chat/${userItem.id}`}
      className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
          {userItem.username.charAt(0).toUpperCase()}
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(userItem.status)}`}>
          {(isUserOnline(userItem.id) || userItem.status === 'online') && (
            <div className="w-full h-full rounded-full bg-green-500 animate-pulse"></div>
          )}
        </div>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="font-medium text-gray-900">{userItem.username}</h3>
        {showLastMessage && lastMessage && (
          <p className="text-sm text-gray-500 truncate">
            {lastMessage.message}
          </p>
        )}
      </div>
      {showLastMessage && lastMessage && (
        <div className="text-xs text-gray-400">
          {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </Link>
  );

  const GroupListItem = ({ group }) => (
    <Link
      to={`/group/${group._id}`}
      className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white">
          <UserGroupIcon className="w-6 h-6" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {group.memberCount || group.members?.length || 0}
        </div>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="font-medium text-gray-900">{group.groupName}</h3>
        <p className="text-sm text-gray-500">
          {group.memberCount || group.members?.length || 0} members
        </p>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-gray-900">{user?.username}</h2>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={logout}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'chats'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'groups'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' && (
            <div>
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <UserListItem
                    key={conv.user.id}
                    userItem={conv.user}
                    showLastMessage={true}
                    lastMessage={conv.lastMessage}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start chatting with users from the Users tab</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'groups' && (
            <div>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <GroupListItem key={group._id} group={group} />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No groups yet</p>
                  <p className="text-sm">Create or join groups to start chatting</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((userItem) => (
                  <UserListItem key={userItem.id} userItem={userItem} />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <UserPlusIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No users found</p>
                  <p className="text-sm">Try adjusting your search</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ChatBubbleLeftRightIcon className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to LastBench</h2>
          <p className="text-gray-600 mb-4">Select a conversation or user to start chatting</p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600">
                {onlineUsers.length + 1} online
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-semibold">{conversations.length}</span>
              </div>
              <p className="text-sm text-gray-600">Conversations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-semibold">{groups.length}</span>
              </div>
              <p className="text-sm text-gray-600">Groups</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
