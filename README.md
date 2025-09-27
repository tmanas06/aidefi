# AgentChat - B2C Agent Communication Platform

A modern chatbot interface built with Next.js for agent-to-agent communication in B2C dApps. This platform enables seamless communication between customers and AI agents with real-time messaging capabilities.

## Features

### 🤖 Agent Management
- **Multiple Agent Types**: Customer service, sales, technical support, and general agents
- **Real-time Status**: Online, busy, and offline status indicators
- **Agent Profiles**: Detailed agent information with roles and descriptions
- **Smart Routing**: Automatic agent assignment based on availability and expertise

### 💬 Chat Interface
- **Real-time Messaging**: WebSocket-powered instant communication
- **Message Bubbles**: Modern chat UI with distinct user and agent message styling
- **Typing Indicators**: Visual feedback when agents are typing
- **Message History**: Persistent chat history and session management
- **File Attachments**: Support for file sharing (UI ready)

### 🔄 Agent-to-Agent Communication
- **Session Transfer**: Seamless handoff between agents
- **Collaborative Support**: Agents can collaborate on customer issues
- **Internal Notes**: Private communication between agents
- **Escalation System**: Automatic escalation for complex issues

### 📊 Dashboard & Analytics
- **Live Dashboard**: Real-time view of active conversations
- **Agent Performance**: Metrics and analytics for agent efficiency
- **Notification System**: Real-time alerts and notifications
- **Settings Management**: Configurable chat preferences

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Real-time**: Socket.io for WebSocket communication
- **Icons**: Lucide React
- **State Management**: React hooks and context

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aidefi
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your configuration:
```env
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/
│   ├── agents/            # Agent management components
│   ├── chat/              # Chat interface components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and services
└── types/                 # TypeScript type definitions
```

## Key Components

### Chat Interface
- `ChatInterface`: Main chat container with message history
- `MessageBubble`: Individual message display component
- `MessageInput`: Message composition and sending

### Agent Management
- `AgentList`: Grid/list view of available agents
- `AgentCard`: Individual agent profile card
- `AgentStatus`: Real-time status indicators

### WebSocket Integration
- `WebSocketService`: Core WebSocket communication service
- `useWebSocket`: React hook for WebSocket integration
- Real-time message delivery and agent status updates

## Usage

### Starting a Chat Session
1. Browse available agents in the agent list
2. Click "Start Chat" on any online agent
3. Begin your conversation with real-time messaging

### Agent Features
- **Customer Service**: Order support, account management
- **Sales**: Product information, sales assistance
- **Technical**: Troubleshooting, technical support
- **General**: General inquiries and support

### Session Management
- Transfer conversations between agents
- End sessions gracefully
- View conversation history
- Real-time typing indicators

## Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Adding New Features
1. Create components in appropriate directories
2. Add types in `src/types/`
3. Implement WebSocket events in `src/lib/websocket.ts`
4. Update the main dashboard as needed

## WebSocket Events

### Client to Server
- `join_agent_room`: Join agent's communication room
- `leave_agent_room`: Leave agent room
- `send_message`: Send message to agent
- `transfer_session`: Transfer session to another agent

### Server to Client
- `message_received`: Receive new message
- `agent_typing`: Agent typing status
- `agent_status_change`: Agent status updates
- `session_transfer`: Session transferred notification

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.