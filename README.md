# LastBench - Real-time Chat Application

A comprehensive real-time messaging platform designed for students and communities, supporting both web and mobile platforms.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login system
- **Real-time Chat**: Instant messaging with Socket.io
- **Private Chats**: One-on-one conversations
- **Group Chats**: Multi-user group conversations
- **Online Status**: See who's online/offline
- **File Sharing**: Share documents, images, and media
- **Emoji Support**: Rich emoji picker integration
- **Notifications**: Push notifications for new messages

### Platform Features
- **Web Application**: Modern React-based responsive web app
- **Android App**: Native Flutter mobile application
- **Cross-platform Sync**: Seamless experience across devices

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File upload handling

### Frontend (Web)
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time client
- **Axios** - HTTP client
- **React Router** - Navigation

### Mobile (Android)
- **Flutter** - Mobile framework
- **Provider** - State management
- **Socket.io Client** - Real-time client
- **Firebase Messaging** - Push notifications
- **Image Picker** - File selection

## 📁 Project Structure

```
lastbench/
├── backend/                 # Node.js backend server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── uploads/            # File upload directory
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React web application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main App component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── android/                # Flutter mobile app
│   ├── lib/
│   │   ├── screens/        # App screens
│   │   ├── widgets/        # Custom widgets
│   │   ├── providers/      # State management
│   │   └── services/       # API services
│   └── pubspec.yaml        # Flutter dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Flutter SDK (for mobile development)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd lastbench
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lastbench
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

4. **Start Backend Server**
```bash
npm run dev
```

5. **Frontend Setup**
```bash
cd frontend
npm install
```

6. **Start Frontend Development Server**
```bash
npm start
```

7. **Mobile App Setup**
```bash
cd android
flutter pub get
```

8. **Run Mobile App**
```bash
flutter run
```

## 📱 Mobile App Setup

### Android Development
1. Install Android Studio
2. Set up Android SDK
3. Create an Android virtual device or connect a physical device
4. Run `flutter doctor` to verify setup
5. Navigate to the android directory and run `flutter run`

### Firebase Setup (for Push Notifications)
1. Create a Firebase project
2. Download `google-services.json` and place it in `android/app/`
3. Configure Firebase Cloud Messaging
4. Update Firebase credentials in the app

## 🔧 Configuration

### Backend Configuration
- Update MongoDB connection string in `.env`
- Configure JWT secret for production
- Set up file upload limits and allowed types
- Configure CORS settings for production domains

### Frontend Configuration
- Update API base URL in `src/contexts/AuthContext.js`
- Configure Socket.io server URL
- Set up Firebase Cloud Messaging for web notifications

### Mobile Configuration
- Update API base URL in `lib/services/api_service.dart`
- Configure Socket.io server URL
- Set up Firebase project for push notifications

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Chat Endpoints
- `GET /api/chat/history/:userId` - Get chat history
- `POST /api/chat/send` - Send message
- `GET /api/chat/conversations` - Get recent conversations
- `PUT /api/chat/read/:userId` - Mark messages as read

### Group Endpoints
- `POST /api/group/create` - Create new group
- `GET /api/group/my-groups` - Get user's groups
- `GET /api/group/:groupId` - Get group details
- `POST /api/group/:groupId/message` - Send group message

### User Endpoints
- `GET /api/user/all` - Get all users
- `GET /api/user/online` - Get online users
- `PUT /api/user/profile` - Update profile
- `GET /api/user/search` - Search users

### File Upload Endpoints
- `POST /api/upload/file` - Upload file
- `POST /api/upload/profile-image` - Upload profile image
- `DELETE /api/upload/file/:filename` - Delete file

## 🔌 Socket.io Events

### Client to Server Events
- `joinUser` - User joins their personal room
- `privateMessage` - Send private message
- `groupMessage` - Send group message
- `typing` - Send typing indicator

### Server to Client Events
- `receivePrivateMessage` - Receive private message
- `receiveGroupMessage` - Receive group message
- `userTyping` - Receive typing indicator
- `userOnline` - User came online
- `userOffline` - User went offline

## 🚀 Deployment

### Backend Deployment
1. Deploy to Render, Railway, or AWS
2. Set up MongoDB Atlas for production database
3. Configure environment variables
4. Set up SSL certificates

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Vercel, Netlify, or AWS S3
3. Configure environment variables
4. Set up custom domain

### Mobile App Deployment
1. Build APK: `flutter build apk`
2. Build for release: `flutter build apk --release`
3. Upload to Google Play Store
4. Configure Firebase for production

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting for API endpoints
- File upload validation
- CORS configuration
- Input sanitization
- Secure socket connections

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Mobile Testing
```bash
cd android
flutter test
```

## 📊 Performance Optimization

- Database indexing for faster queries
- Image compression and caching
- Lazy loading for chat history
- Connection pooling for database
- CDN for static assets
- Code splitting for frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints
- Test with the provided examples

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- Real-time messaging
- User authentication
- File sharing
- Mobile and web applications

---

**LastBench** - Connect. Chat. Collaborate. 🚀
