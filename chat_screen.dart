import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/chat_provider.dart';
import '../providers/socket_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/message_bubble.dart';
import '../widgets/emoji_picker.dart';

class ChatScreen extends StatefulWidget {
  final String userId;
  final String userName;

  const ChatScreen({
    super.key,
    required this.userId,
    required this.userName,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _showEmojiPicker = false;
  bool _isOtherUserTyping = false;

  @override
  void initState() {
    super.initState();
    _loadChatHistory();
    _setupSocketListeners();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _loadChatHistory() async {
    final chatProvider = Provider.of<ChatProvider>(context, listen: false);
    await chatProvider.loadChatHistory(widget.userId);
    _scrollToBottom();
  }

  void _setupSocketListeners() {
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    socketProvider.connect(authProvider.user!['id']);

    socketProvider.setupMessageHandlers(
      onPrivateMessage: (data) {
        if (data['senderId'] == widget.userId || data['receiverId'] == widget.userId) {
          final chatProvider = Provider.of<ChatProvider>(context, listen: false);
          chatProvider.addMessage({
            '_id': DateTime.now().millisecondsSinceEpoch.toString(),
            'senderId': {'_id': data['senderId']},
            'message': data['message'],
            'timestamp': data['timestamp'],
            'messageType': 'text',
          });
          _scrollToBottom();
        }
      },
      onUserTyping: (data) {
        if (data['userId'] == widget.userId) {
          setState(() {
            _isOtherUserTyping = data['isTyping'];
          });
        }
      },
    );
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.trim().isEmpty) return;

    final messageText = _messageController.text.trim();
    _messageController.clear();

    final chatProvider = Provider.of<ChatProvider>(context, listen: false);
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    // Send via API
    await chatProvider.sendMessage(widget.userId, messageText);

    // Send via socket for real-time
    socketProvider.sendPrivateMessage(
      widget.userId,
      messageText,
      authProvider.user!['id'],
    );

    _scrollToBottom();
  }

  void _onEmojiSelected(String emoji) {
    _messageController.text += emoji;
    setState(() {
      _showEmojiPicker = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF3B82F6),
        foregroundColor: Colors.white,
        elevation: 0,
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: Colors.white,
              radius: 20,
              child: Text(
                widget.userName.substring(0, 1).toUpperCase(),
                style: const TextStyle(
                  color: Color(0xFF3B82F6),
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.userName,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Consumer<SocketProvider>(
                    builder: (context, socketProvider, child) {
                      return Text(
                        socketProvider.isUserOnline(widget.userId) ? 'Online' : 'Offline',
                        style: TextStyle(
                          fontSize: 12,
                          color: socketProvider.isUserOnline(widget.userId)
                              ? Colors.green[200]
                              : Colors.grey[300],
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {
              // Show more options
            },
            icon: const Icon(Icons.more_vert),
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages
          Expanded(
            child: Consumer<ChatProvider>(
              builder: (context, chatProvider, child) {
                if (chatProvider.isLoading) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }

                if (chatProvider.messages.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.chat_bubble_outline,
                          size: 80,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No messages yet',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Start the conversation!',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(16),
                  itemCount: chatProvider.messages.length + (_isOtherUserTyping ? 1 : 0),
                  itemBuilder: (context, index) {
                    if (index == chatProvider.messages.length && _isOtherUserTyping) {
                      return const TypingIndicator();
                    }

                    final message = chatProvider.messages[index];
                    final authProvider = Provider.of<AuthProvider>(context);
                    final isSent = message['senderId']['_id'] == authProvider.user!['id'];

                    return MessageBubble(
                      message: message['message'],
                      isSent: isSent,
                      timestamp: message['timestamp'] ?? message['createdAt'],
                    );
                  },
                );
              },
            ),
          ),

          // Typing Indicator
          if (_showEmojiPicker)
            Container(
              height: 250,
              child: EmojiPicker(
                onEmojiSelected: _onEmojiSelected,
              ),
            ),

          // Message Input
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              children: [
                IconButton(
                  onPressed: () {
                    setState(() {
                      _showEmojiPicker = !_showEmojiPicker;
                    });
                  },
                  icon: Icon(
                    _showEmojiPicker ? Icons.keyboard : Icons.emoji_emotions_outlined,
                    color: Colors.grey[600],
                  ),
                ),
                IconButton(
                  onPressed: () {
                    // Handle file attachment
                  },
                  icon: Icon(
                    Icons.attach_file,
                    color: Colors.grey[600],
                  ),
                ),
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: const InputDecoration(
                      hintText: 'Type a message...',
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 16),
                    ),
                    maxLines: null,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                IconButton(
                  onPressed: _sendMessage,
                  icon: Container(
                    decoration: const BoxDecoration(
                      color: Color(0xFF3B82F6),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.send,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class TypingIndicator extends StatelessWidget {
  const TypingIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                _buildDot(0),
                const SizedBox(width: 4),
                _buildDot(1),
                const SizedBox(width: 4),
                _buildDot(2),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDot(int index) {
    return AnimatedContainer(
      duration: Duration(milliseconds: 300 + (index * 100)),
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        color: Colors.grey[600],
        shape: BoxShape.circle,
      ),
    );
  }
}
