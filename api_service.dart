import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class ApiService {
  static const String _baseUrl = 'http://localhost:5000/api';
  String? _authToken;

  void setAuthToken(String token) {
    _authToken = token;
  }

  void clearAuthToken() {
    _authToken = null;
  }

  Map<String, String> get _headers {
    final headers = {'Content-Type': 'application/json'};
    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  Future<Map<String, dynamic>> _handleResponse(http.Response response) async {
    try {
      final body = response.body.isEmpty ? {} : json.decode(response.body);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return {
          'success': true,
          'data': body,
          'statusCode': response.statusCode,
        };
      } else {
        return {
          'success': false,
          'message': body['message'] ?? 'Request failed',
          'statusCode': response.statusCode,
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Response parsing error',
        'statusCode': response.statusCode,
      };
    }
  }

  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl$endpoint'),
        headers: _headers,
      );
      return _handleResponse(response);
    } catch (e) {
      if (kDebugMode) print('GET Error: $e');
      return {
        'success': false,
        'message': 'Network error',
      };
    }
  }

  Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl$endpoint'),
        headers: _headers,
        body: json.encode(data),
      );
      return _handleResponse(response);
    } catch (e) {
      if (kDebugMode) print('POST Error: $e');
      return {
        'success': false,
        'message': 'Network error',
      };
    }
  }

  Future<Map<String, dynamic>> put(String endpoint, Map<String, dynamic> data) async {
    try {
      final response = await http.put(
        Uri.parse('$_baseUrl$endpoint'),
        headers: _headers,
        body: json.encode(data),
      );
      return _handleResponse(response);
    } catch (e) {
      if (kDebugMode) print('PUT Error: $e');
      return {
        'success': false,
        'message': 'Network error',
      };
    }
  }

  Future<Map<String, dynamic>> delete(String endpoint) async {
    try {
      final response = await http.delete(
        Uri.parse('$_baseUrl$endpoint'),
        headers: _headers,
      );
      return _handleResponse(response);
    } catch (e) {
      if (kDebugMode) print('DELETE Error: $e');
      return {
        'success': false,
        'message': 'Network error',
      };
    }
  }

  Future<Map<String, dynamic>> uploadFile(
    String endpoint,
    String filePath,
    Map<String, String> fields,
  ) async {
    try {
      final request = http.MultipartRequest('POST', Uri.parse('$_baseUrl$endpoint'));
      
      // Add headers
      if (_authToken != null) {
        request.headers['Authorization'] = 'Bearer $_authToken';
      }
      
      // Add fields
      request.fields.addAll(fields);
      
      // Add file
      final file = await http.MultipartFile.fromPath('file', filePath);
      request.files.add(file);
      
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      
      return _handleResponse(response);
    } catch (e) {
      if (kDebugMode) print('Upload Error: $e');
      return {
        'success': false,
        'message': 'File upload error',
      };
    }
  }
}
