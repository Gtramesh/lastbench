# LastBench Android App

Native Flutter mobile application for the LastBench chat platform with real-time messaging capabilities.

## 🚀 Features

- **Real-time Chat**: Instant messaging with Socket.io
- **User Authentication**: Secure login and registration
- **Private & Group Chats**: Multiple conversation types
- **File Sharing**: Upload and share files
- **Emoji Support**: Built-in emoji picker
- **Online Status**: Real-time user presence
- **Push Notifications**: Firebase Cloud Messaging
- **Offline Support**: Message caching
- **Material Design**: Modern Android UI

## 🛠 Technology Stack

- **Flutter 3.0+** - Cross-platform framework
- **Provider** - State management
- **Socket.io Client** - Real-time communication
- **Firebase Messaging** - Push notifications
- **Image Picker** - File selection
- **Shared Preferences** - Local storage
- **Flutter Secure Storage** - Secure token storage
- **HTTP** - API communication
- **Local Notifications** - In-app notifications

## 📁 Project Structure

```
android/
├── lib/
│   ├── screens/           # App screens
│   │   ├── splash_screen.dart      # App splash screen
│   │   ├── login_screen.dart       # Login page
│   │   ├── register_screen.dart    # Registration page
│   │   ├── dashboard_screen.dart   # Main dashboard
│   │   ├── chat_screen.dart        # Private chat
│   │   └── profile_screen.dart     # User profile
│   ├── widgets/           # Custom widgets
│   │   ├── custom_button.dart      # Custom button widget
│   │   ├── custom_text_field.dart  # Custom input field
│   │   ├── message_bubble.dart     # Chat message bubble
│   │   ├── chat_list_item.dart     # Chat list item
│   │   └── emoji_picker.dart      # Emoji picker widget
│   ├── providers/         # State management
│   │   ├── auth_provider.dart      # Authentication state
│   │   ├── chat_provider.dart      # Chat state management
│   │   └── socket_provider.dart    # Socket.io state
│   ├── services/          # API and services
│   │   ├── api_service.dart        # HTTP API service
│   │   └── notification_service.dart # Push notifications
│   └── main.dart          # App entry point
├── android/               # Android-specific files
├── ios/                   # iOS-specific files (future)
├── pubspec.yaml           # Flutter dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Flutter SDK (v3.0 or higher)
- Android Studio with Android SDK
- Physical Android device or emulator
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd lastbench/android
```

2. **Install dependencies**
```bash
flutter pub get
```

3. **Check Flutter setup**
```bash
flutter doctor
```

4. **Run the app**
```bash
flutter run
```

### Build APK
```bash
# Debug APK
flutter build apk

# Release APK
flutter build apk --release

# App Bundle (for Play Store)
flutter build appbundle --release
```

## 🎨 UI Components

### Custom Widgets
- **CustomButton**: Styled button with loading states
- **CustomTextField**: Input field with validation
- **MessageBubble**: Chat message display
- **ChatListItem**: Conversation list item
- **EmojiPicker**: Emoji selection widget

### Design System
- **Primary Color**: Blue (#3B82F6)
- **Accent Colors**: Purple, Green, Red
- **Typography**: Inter font family
- **Icons**: Material Icons
- **Animations**: Smooth transitions

## 🔌 State Management

### AuthProvider
Manages user authentication:
- Login/logout functionality
- Token management
- User profile data
- Auto-login from storage

### ChatProvider
Handles chat functionality:
- Message history
- User conversations
- Group management
- File uploads

### SocketProvider
Real-time communication:
- Socket connection
- Online users
- Message events
- Typing indicators

## 📱 Screens Overview

### Splash Screen
- Animated logo
- App initialization
- Authentication check
- Navigation to appropriate screen

### Login Screen
- Email/password inputs
- Form validation
- Loading states
- Error handling
- Registration link

### Register Screen
- Username, email, password fields
- Password confirmation
- Validation feedback
- Auto-login after registration

### Dashboard
- Tab navigation (Chats/Groups/Users)
- Recent conversations
- Online users list
- Search functionality
- User profile access

### Chat Screen
- Real-time messaging
- Message history
- Emoji picker
- File sharing
- Typing indicators
- Online status

### Profile Screen
- User information display
- Profile picture upload
- Username editing
- Logout functionality

## 🔧 Configuration

### Environment Setup
Update API base URL in `lib/services/api_service.dart`:
```dart
static const String _baseUrl = 'http://your-server-url:5000/api';
```

### Firebase Setup
1. Create Firebase project
2. Download `google-services.json`
3. Place in `android/app/`
4. Update AndroidManifest.xml
5. Configure FCM in app

### Android Permissions
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.VIBRATE" />
```

## 📡 Socket.io Integration

### Connection Management
- Automatic connection on login
- Reconnection logic
- Room joining
- Event handling

### Real-time Events
- Private messages
- Group messages
- Typing indicators
- Online status updates
- User presence

### Message Handling
- Real-time delivery
- Local storage
- Sync with server
- Error recovery

## 📁 File Upload

### Supported Formats
- Images: JPEG, PNG, GIF
- Documents: PDF, DOC, DOCX
- Media: MP4, MP3
- Archives: ZIP

### Upload Process
1. Select file from device
2. Validate file type/size
3. Upload with progress
4. Display in chat
5. Handle errors

## 🔔 Push Notifications

### Firebase Cloud Messaging
- Token registration
- Message handling
- Local notifications
- Background processing

### Notification Types
- New messages
- Chat invitations
- User mentions
- System updates

## 🎯 Features in Detail

### Authentication
- JWT token storage
- Auto-login
- Secure storage
- Session management

### Chat Features
- Real-time messaging
- Message timestamps
- Read receipts
- File sharing
- Emoji support

### User Interface
- Material Design 3
- Dark mode ready
- Accessibility
- Smooth animations
- Gesture support

### Performance
- Lazy loading
- Image caching
- Memory management
- Battery optimization
- Network efficiency

## 🧪 Testing

### Unit Tests
```bash
flutter test
```

### Widget Tests
```bash
flutter test --integration
```

### Integration Tests
```bash
flutter drive
```

### Code Coverage
```bash
flutter test --coverage
```

## 🚀 Deployment

### Google Play Store
1. Build release APK/AAB
2. Create Play Console account
3. Upload app bundle
4. Configure store listing
5. Submit for review

### APK Distribution
```bash
# Build signed APK
flutter build apk --release --signing-config release

# Install via ADB
adb install app-release.apk
```

### App Signing
Generate signing key:
```bash
keytool -genkey -v -keystore ~/upload-keystore.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

## 🔒 Security Features

- **Secure Storage**: Flutter Secure Storage
- **Token Encryption**: Encrypted token storage
- **Network Security**: HTTPS only
- **Input Validation**: Form sanitization
- **Permission Handling**: Runtime permissions

## 📊 Performance Optimization

- **Image Optimization**: Caching and compression
- **Memory Management**: Efficient widget usage
- **Network Optimization**: Request batching
- **Battery Efficiency**: Background processing
- **Startup Time**: Lazy initialization

## 🐛 Troubleshooting

### Common Issues
- **Socket Connection**: Check server URL
- **Build Errors**: Update Flutter SDK
- **Firebase Setup**: Verify configuration
- **Permissions**: Grant required permissions

### Debug Tools
- Flutter Inspector
- Dart DevTools
- Android Studio Debugger
- Console logging

### Performance Profiling
```bash
flutter run --profile
```

## 🔄 Updates

### Version History
- **v1.0.0**: Initial release
- **v1.1.0**: Added push notifications
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
