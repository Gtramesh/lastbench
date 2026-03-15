import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  
  bool _isAuthenticated = false;
  bool _isLoading = false;
  String? _errorMessage;
  Map<String, dynamic>? _user;
  
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  Map<String, dynamic>? get user => _user;

  AuthProvider() {
    checkAuthStatus();
  }

  Future<void> checkAuthStatus() async {
    try {
      final token = await _secureStorage.read(key: 'token');
      if (token != null) {
        _apiService.setAuthToken(token);
        final response = await _apiService.get('/auth/me');
        
        if (response['success']) {
          _user = response['data']['user'];
          _isAuthenticated = true;
        } else {
          await _secureStorage.delete(key: 'token');
          _isAuthenticated = false;
        }
      }
    } catch (e) {
      print('Auth check error: $e');
      _isAuthenticated = false;
    }
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.post('/auth/login', {
        'email': email,
        'password': password,
      });

      if (response['success']) {
        final token = response['data']['token'];
        await _secureStorage.write(key: 'token', value: token);
        _apiService.setAuthToken(token);
        
        _user = response['data']['user'];
        _isAuthenticated = true;
        notifyListeners();
        return true;
      } else {
        _setError(response['message'] ?? 'Login failed');
        return false;
      }
    } catch (e) {
      _setError('Network error. Please try again.');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> register(String username, String email, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.post('/auth/register', {
        'username': username,
        'email': email,
        'password': password,
      });

      if (response['success']) {
        final token = response['data']['token'];
        await _secureStorage.write(key: 'token', value: token);
        _apiService.setAuthToken(token);
        
        _user = response['data']['user'];
        _isAuthenticated = true;
        notifyListeners();
        return true;
      } else {
        _setError(response['message'] ?? 'Registration failed');
        return false;
      }
    } catch (e) {
      _setError('Network error. Please try again.');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> logout() async {
    try {
      await _apiService.post('/auth/logout', {});
    } catch (e) {
      print('Logout error: $e');
    } finally {
      await _secureStorage.delete(key: 'token');
      _apiService.clearAuthToken();
      _user = null;
      _isAuthenticated = false;
      notifyListeners();
    }
  }

  Future<bool> updateProfile(Map<String, dynamic> profileData) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.put('/user/profile', profileData);

      if (response['success']) {
        _user = response['data']['user'];
        notifyListeners();
        return true;
      } else {
        _setError(response['message'] ?? 'Profile update failed');
        return false;
      }
    } catch (e) {
      _setError('Network error. Please try again.');
      return false;
    } finally {
      _setLoading(false);
    }
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
