# Agent Chat Protocol Integration

This document explains how the Agent Chat Protocol has been integrated into the AiDeFi project, specifically in the merchant agent, enabling standardized communication between agents.

## 🚀 Overview

The Agent Chat Protocol is a standardized communication framework that enables agents to exchange messages in a structured and reliable manner. It defines rules and message formats that ensure consistent communication between agents, similar to how a common language enables effective human interaction.

## 📋 Implementation Details

### **Merchant Agent Integration**

The merchant agent (`python/merchant.py`) has been enhanced with full chat protocol support:

#### **1. Protocol Components Imported**
```python
from uagents_core.contrib.protocols.chat import (
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    ResourceContent,
    Resource,
    MetadataContent,
    StartSessionContent,
    EndSessionContent,
    chat_protocol_spec
)
```

#### **2. Chat Protocol Initialization**
```python
# Initialize the chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)

# Include the chat protocol in the merchant agent
merchant_agent.include(chat_proto, publish_manifest=True)
```

#### **3. Message Handlers**

**Chat Message Handler:**
```python
@chat_proto.on_message(ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages using the standardized chat protocol"""
    # Process message content
    # Send acknowledgements
    # Generate responses
```

**Acknowledgement Handler:**
```python
@chat_proto.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle chat acknowledgements"""
    # Log acknowledgements
    # Track message delivery
```

## 🔧 API Endpoints

### **HTTP Chat Endpoints**

The merchant agent now provides multiple ways to interact via HTTP:

#### **1. Standard Chat Endpoint**
```http
POST /api/chat
Content-Type: application/json

{
    "message": "Hello! Show me your products",
    "user_id": "user123"
}
```

**Response:**
```json
{
    "response": "🛍️ Welcome to the Merchant Agent!...",
    "agent_id": "agent1q...",
    "agent_name": "merchant",
    "timestamp": "2024-01-01T12:00:00Z",
    "protocol": "chat_protocol_v1"
}
```

#### **2. Chat Protocol Endpoint**
```http
POST /api/chat-protocol
Content-Type: application/json

{
    "message": "I want to buy item 1",
    "user_id": "user456"
}
```

**Response:**
```json
{
    "chat_message": {
        "timestamp": "2024-01-01T12:00:00Z",
        "msg_id": "123e4567-e89b-12d3-a456-426614174000",
        "content": [
            {
                "type": "text",
                "text": "💳 Ready to Make a Purchase!..."
            }
        ]
    },
    "agent_id": "agent1q...",
    "agent_name": "merchant",
    "protocol_version": "chat_protocol_v1"
}
```

#### **3. Status Endpoint**
```http
GET /api/status
```

**Response:**
```json
{
    "status": "online",
    "agent_id": "agent1q...",
    "agent_name": "merchant",
    "port": 8003,
    "protocols": ["chat_protocol_v1", "http_api"],
    "capabilities": [
        "e-commerce_operations",
        "blockchain_payments",
        "chat_protocol_messaging",
        "payment_verification"
    ],
    "message": "Merchant agent merchant is ready for e-commerce and chat operations"
}
```

## 💬 Message Flow

### **Agent-to-Agent Communication**

1. **Agent A** sends a `ChatMessage` to **Agent B**
2. **Agent B** sends a `ChatAcknowledgement` back to **Agent A**
3. **Agent B** can then send a `ChatMessage` response to **Agent A**
4. **Agent A** sends a `ChatAcknowledgement` back to **Agent B**

### **HTTP-to-Agent Communication**

1. **Client** sends HTTP request to `/api/chat` or `/api/chat-protocol`
2. **Merchant Agent** processes message using chat protocol logic
3. **Agent** returns structured response in chat protocol format
4. **Client** receives response with protocol metadata

## 🎯 Merchant Agent Capabilities

The merchant agent now supports comprehensive e-commerce operations through chat protocol:

### **Product Management**
- Browse available products
- Get product details and pricing
- Handle inventory queries

### **Purchase Operations**
- Initiate purchases with crypto payments
- Provide payment details (token address, amount, recipient)
- Verify blockchain transactions

### **Payment Verification**
- Check transaction status on blockchain
- Confirm payment receipt
- Provide transaction details and explorer links

### **Customer Support**
- Answer general inquiries
- Provide help and guidance
- Handle error cases gracefully

## 🧪 Testing

### **Test Script**

A comprehensive test script (`python/test_chat_protocol.py`) is provided to demonstrate the integration:

```bash
cd python
python test_chat_protocol.py
```

**Test Coverage:**
- HTTP API endpoint testing
- Chat protocol message simulation
- Response format validation
- Error handling verification

### **Manual Testing**

#### **1. Start the Merchant Agent**
```bash
cd python
python merchant.py
```

#### **2. Test HTTP Endpoints**
```bash
# Test status
curl http://127.0.0.1:8003/api/status

# Test chat
curl -X POST http://127.0.0.1:8003/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello! Show me products", "user_id": "test"}'

# Test chat protocol
curl -X POST http://127.0.0.1:8003/api/chat-protocol \
  -H "Content-Type: application/json" \
  -d '{"message": "Buy item 1", "user_id": "test"}'
```

#### **3. Test Agent-to-Agent Communication**
```bash
# Run test agent (requires merchant agent address)
python test_chat_protocol.py
```

## 🔗 Integration with Frontend

The chat protocol integration enables the frontend to communicate with agents using standardized message formats:

### **Frontend Service Integration**

```typescript
// Example frontend service using chat protocol
class MerchantChatService {
  async sendMessage(message: string, userId: string) {
    const response = await fetch('/api/chat-protocol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, user_id: userId })
    });
    
    const data = await response.json();
    return data.chat_message.content[0].text;
  }
}
```

### **WebSocket Integration**

The chat protocol can be extended to support real-time WebSocket communication:

```typescript
// WebSocket chat protocol integration
const ws = new WebSocket('ws://localhost:8003/ws');
ws.onmessage = (event) => {
  const chatMessage = JSON.parse(event.data);
  // Handle ChatMessage format
};
```

## 🚀 Benefits

### **1. Standardized Communication**
- Consistent message formats across all agents
- Reliable message delivery with acknowledgements
- Type-safe message handling

### **2. Enhanced Reliability**
- Built-in acknowledgement system
- Message ID tracking for delivery confirmation
- Structured error handling

### **3. Scalability**
- Easy integration with new agents
- Support for multiple content types (text, resources, metadata)
- Session and stream management capabilities

### **4. Interoperability**
- Compatible with Fetch.ai agent ecosystem
- HTTP API fallback for web integration
- Support for various communication patterns

## 🔮 Future Enhancements

### **Planned Features**
- **Resource Sharing**: Support for file and image sharing
- **Session Management**: Persistent chat sessions
- **Stream Support**: Real-time data streaming
- **Multi-Agent Coordination**: Agent collaboration workflows

### **Advanced Capabilities**
- **LLM Integration**: Connect to advanced language models
- **Payment Processing**: Direct crypto payment handling
- **Smart Contract Integration**: Automated contract interactions
- **Analytics**: Message and interaction analytics

## 📚 Resources

- [Fetch.ai Chat Protocol Documentation](https://docs.fetch.ai/)
- [uAgents Framework](https://uagents.fetch.ai/)
- [Agent Communication Patterns](https://docs.agentverse.ai/)

## 🤝 Contributing

To contribute to the chat protocol integration:

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Test with the provided test script
5. Submit a pull request

## 📄 License

This integration follows the same license as the main project.
