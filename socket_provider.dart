import 'dart:async';
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../services/api_service.dart';

class SocketProvider with ChangeNotifier {
  IO.Socket? _socket;
  List<String> _onlineUsers = [];
  bool _isConnected = false;
  
  List<String> get onlineUsers => _onlineUsers;
  bool get isConnected => _isConnected;

  void connect(String userId) {
    if (_socket != null && _isConnected) return;

    try {
      _socket = IO.io('http://localhost:5000', <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': true,
      });

      _socket!.connect();

      _socket!.on('connect', (_) {
        print('Connected to socket server');
        _isConnected = true;
        _socket!.emit('joinUser', userId);
        notifyListeners();
      });

      _socket!.on('disconnect', (_) {
        print('Disconnected from socket server');
        _isConnected = false;
        _onlineUsers.clear();
        notifyListeners();
      });

      _socket!.on('userOnline', (userId) {
        if (!_onlineUsers.contains(userId)) {
          _onlineUsers.add(userId);
          notifyListeners();
        }
      });

      _socket!.on('userOffline', (userId) {
        _onlineUsers.remove(userId);
        notifyListeners();
      });

      _socket!.on('receivePrivateMessage', (data) {
        // Handle incoming private message
        // This will be handled by the chat screen
        print('Received private message: $data');
      });

      _socket!.on('receiveGroupMessage', (data) {
        // Handle incoming group message
        // This will be handled by the group chat screen
        print('Received group message: $data');
      });

      _socket!.on('userTyping', (data) {
        // Handle typing indicator
        print('User typing: $data');
      });

      _socket!.on('error', (error) {
        print('Socket error: $error');
      });

    } catch (e) {
      print('Socket connection error: $e');
    }
  }

  void disconnect() {
    if (_socket != null) {
      _socket!.disconnect();
      _socket = null;
      _isConnected = false;
      _onlineUsers.clear();
      notifyListeners();
    }
  }

  void sendPrivateMessage(String receiverId, String message, String senderId) {
    if (_socket != null && _isConnected) {
      _socket!.emit('privateMessage', {
        'receiverId': receiverId,
        'message': message,
        'senderId': senderId,
      });
    }
  }

  void sendGroupMessage(String groupId, String message, String senderId) {
    if (_socket != null && _isConnected) {
      _socket!.emit('groupMessage', {
        'groupId': groupId,
        'message': message,
        'senderId': senderId,
      });
    }
  }

  void sendTypingIndicator(String receiverId, bool isTyping) {
    if (_socket != null && _isConnected) {
      _socket!.emit('typing', {
        'receiverId': receiverId,
        'isTyping': isTyping,
      });
    }
  }

  bool isUserOnline(String userId) {
    return _onlineUsers.contains(userId);
  }

  void setupMessageHandlers({
    Function(Map<String, dynamic>)? onPrivateMessage,
    Function(Map<String, dynamic>)? onGroupMessage,
    Function(Map<String, dynamic>)? onUserTyping,
  }) {
    if (_socket == null) return;

    if (onPrivateMessage != null) {
      _socket!.off('receivePrivateMessage');
      _socket!.on('receivePrivateMessage', (data) {
        onPrivateMessage(Map<String, dynamic>.from(data));
      });
    }

    if (onGroupMessage != null) {
      _socket!.off('receiveGroupMessage');
      _socket!.on('receiveGroupMessage', (data) {
        onGroupMessage(Map<String, dynamic>.from(data));
      });
    }

    if (onUserTyping != null) {
      _socket!.off('userTyping');
      _socket!.on('userTyping', (data) {
        onUserTyping(Map<String, dynamic>.from(data));
      });
    }
  }
}
