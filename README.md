# LastBench Frontend

Modern React-based web application for the LastBench chat platform with real-time messaging capabilities.

## 🚀 Features

- **Real-time Chat**: Instant messaging with Socket.io
- **User Authentication**: Secure login and registration
- **Private & Group Chats**: Multiple conversation types
- **File Sharing**: Upload and share files
- **Emoji Support**: Rich emoji picker
- **Online Status**: See who's online
- **Responsive Design**: Works on all devices
- **Modern UI**: Clean and intuitive interface

## 🛠 Technology Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Emoji Picker React** - Emoji support
- **React Dropzone** - File uploads

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   └── favicon.ico        # Favicon
├── src/
│   ├── components/        # Reusable components
│   │   └── FileUpload.js # File upload component
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.js # Authentication state
│   │   └── SocketContext.js # Socket.io state
│   ├── pages/             # Page components
│   │   ├── Login.js       # Login page
│   │   ├── Register.js    # Registration page
│   │   ├── Dashboard.js   # Main dashboard
│   │   ├── Chat.js        # Private chat
│   │   └── GroupChat.js   # Group chat
│   ├── App.js             # Main app component
│   ├── index.js           # App entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies
├── tailwind.config.js    # Tailwind configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Environment Configuration**
The app is configured to proxy requests to the backend at `http://localhost:5000`. Update the proxy in `package.json` if your backend runs elsewhere.

3. **Start development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 🎨 UI Components

### Custom Styles
The app uses Tailwind CSS with custom components defined in `src/index.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.input-field` - Form input style
- `.message-bubble` - Chat message style
- `.chat-container` - Chat layout
- `.online-indicator` - Online status dot

### Color Scheme
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)

## 🔌 Context Providers

### AuthContext
Manages user authentication state:
- Login/logout functionality
- User profile management
- Token management
- Protected routes

### SocketContext
Handles real-time communication:
- Socket connection management
- Online user tracking
- Message sending/receiving
- Typing indicators

## 📱 Pages

### Login Page (`/login`)
- Email and password authentication
- Form validation
- Error handling
- Link to registration

### Register Page (`/register`)
- User registration form
- Password confirmation
- Validation feedback
- Auto-login after registration

### Dashboard (`/dashboard`)
- Chat list with recent conversations
- Online users display
- Group management
- User search functionality
- Tab navigation (Chats/Groups/Users)

### Chat Screen (`/chat/:userId`)
- Real-time messaging
- Message history
- Emoji picker
- File upload
- Typing indicators
- Online status display

### Group Chat (`/group/:groupId`)
- Group messaging
- Member list
- Group information
- Message history
- File sharing

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.js`:
- Extended color palette
- Custom animations
- Responsive breakpoints
- Component utilities

### Environment Variables
Create `.env` file for production:
```env
REACT_APP_SERVER_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000/api
```

## 📡 Socket.io Integration

### Connection Events
- Automatic connection on user login
- Join personal room on connect
- Handle disconnections gracefully
- Reconnection logic

### Message Events
- Send/receive private messages
- Send/receive group messages
- Typing indicators
- Online status updates

### Real-time Features
- Instant message delivery
- Online/offline status
- Typing indicators
- Message read receipts

## 📁 File Upload

### Supported Formats
- Images: JPEG, PNG, GIF
- Documents: PDF, DOC, DOCX, TXT
- Media: MP4, MP3
- Archives: ZIP

### Upload Process
1. Select file via file picker
2. Validate file type and size
3. Upload with progress indicator
4. Display file in chat
5. Handle upload errors

## 🎯 Features in Detail

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Secure storage
- Logout functionality

### Chat Features
- Real-time messaging
- Message timestamps
- Read receipts
- Message history pagination
- Search functionality

### User Interface
- Responsive design
- Dark mode ready
- Accessibility features
- Loading states
- Error boundaries

### Notifications
- Toast notifications
- Error messages
- Success confirmations
- Loading indicators

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Testing
```bash
npm run test:e2e
```

## 🚀 Deployment

### Build Process
1. Create production build
2. Optimize assets
3. Generate service worker
4. Deploy to hosting

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Static hosting with CI/CD
- **AWS S3**: Cloud storage with CloudFront
- **Firebase Hosting**: Google cloud hosting

### Environment Setup
```bash
# Production build
npm run build

# Serve build locally
serve -s build -l 3000
```

## 🔒 Security Features

- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Token validation
- **Input Validation**: Form sanitization
- **Secure Storage**: HttpOnly cookies
- **HTTPS Enforcement**: SSL/TLS only

## 📊 Performance

- **Code Splitting**: Lazy loading
- **Image Optimization**: WebP format
- **Caching Strategy**: Service worker
- **Bundle Optimization**: Tree shaking
- **CDN Integration**: Asset delivery

## 🐛 Troubleshooting

### Common Issues
- **Socket Connection**: Check backend URL
- **Authentication**: Verify token storage
- **File Upload**: Check file size limits
- **Routing**: Confirm React Router setup

### Debug Tools
- React DevTools
- Network tab in browser
- Console logging
- Socket.io debugger

## 🔄 Updates

### Version History
- **v1.0.0**: Initial release
- **v1.1.0**: Added file sharing
- **v1.2.0**: Enhanced UI/UX
- **v1.3.0**: Performance improvements

### Upcoming Features
- Voice messages
- Video calls
- Message reactions
- Dark mode
- Multi-language support

## 📄 License

MIT License - see LICENSE file for details.
