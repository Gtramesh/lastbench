import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ChatProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Map<String, dynamic>> _users = [];
  List<Map<String, dynamic>> _conversations = [];
  List<Map<String, dynamic>> _groups = [];
  List<Map<String, dynamic>> _messages = [];
  
  bool _isLoading = false;
  String? _errorMessage;
  
  List<Map<String, dynamic>> get users => _users;
  List<Map<String, dynamic>> get conversations => _conversations;
  List<Map<String, dynamic>> get groups => _groups;
  List<Map<String, dynamic>> get messages => _messages;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> loadUsers() async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.get('/user/all');
      
      if (response['success']) {
        _users = List<Map<String, dynamic>>.from(response['data']);
      } else {
        _setError(response['message'] ?? 'Failed to load users');
      }
    } catch (e) {
      _setError('Network error. Please try again.');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadConversations() async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.get('/chat/conversations');
      
      if (response['success']) {
        _conversations = List<Map<String, dynamic>>.from(response['data']['conversations'] ?? []);
      } else {
        _setError(response['message'] ?? 'Failed to load conversations');
      }
    } catch (e) {
      _setError('Network error. Please try again.');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadGroups() async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.get('/group/my-groups');
      
      if (response['success']) {
        _groups = List<Map<String, dynamic>>.from(response['data']['groups'] ?? []);
      } else {
        _setError(response['message'] ?? 'Failed to load groups');
      }
    } catch (e) {
      _setError('Network error. Please try again.');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadChatHistory(String userId) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.get('/chat/history/$userId');
      
      if (response['success']) {
        _messages = List<Map<String, dynamic>>.from(response['data']['messages'] ?? []);
      } else {
        _setError(response['message'] ?? 'Failed to load messages');
      }
    } catch (e) {
      _setError('Network error. Please try again.');
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> sendMessage(String receiverId, String message) async {
    try {
      final response = await _apiService.post('/chat/send', {
        'receiverId': receiverId,
        'message': message,
      });

      if (response['success']) {
        _messages.add(response['data']['data']);
        notifyListeners();
        return true;
      } else {
        _setError(response['message'] ?? 'Failed to send message');
        return false;
      }
    } catch (e) {
      _setError('Network error. Please try again.');
      return false;
    }
  }

  Future<bool> createGroup(String groupName, List<String> memberIds) async {
    try {
      final response = await _apiService.post('/group/create', {
        'groupName': groupName,
        'memberIds': memberIds,
      });

      if (response['success']) {
        _groups.add(response['data']['group']);
        notifyListeners();
        return true;
      } else {
        _setError(response['message'] ?? 'Failed to create group');
        return false;
      }
    } catch (e) {
      _setError('Network error. Please try again.');
      return false;
    }
  }

  Future<void> searchUsers(String query) async {
    if (query.isEmpty) {
      await loadUsers();
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.get('/user/search?q=$query');
      
      if (response['success']) {
        _users = List<Map<String, dynamic>>.from(response['data']);
      } else {
        _setError(response['message'] ?? 'Failed to search users');
      }
    } catch (e) {
      _setError('Network error. Please try again.');
    } finally {
      _setLoading(false);
    }
  }

  void addMessage(Map<String, dynamic> message) {
    _messages.add(message);
    notifyListeners();
  }

  void clearMessages() {
    _messages.clear();
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
