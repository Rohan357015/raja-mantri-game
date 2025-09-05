# Raja Mantri Game Frontend

A React-based frontend for the Raja Mantri multiplayer card game.

## Features

- **Create Room**: Host a new game room with custom round settings
- **Join Room**: Join an existing room using a room code
- **Room Management**: View room details, player list, and game status
- **Real-time Updates**: Live room status and player management
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating a Room

1. Click "Create Room" on the homepage
2. Enter your player name
3. Select the number of rounds (1-20)
4. Click "Create Room"
5. Share the generated room code with other players

### Joining a Room

1. Click "Join Room" on the homepage
2. Enter your player name
3. Enter the room code provided by the host
4. Click "Join Room"

### Room Management

- View all players in the room
- See room status (waiting/playing)
- Host can start the game when 2+ players are present
- Refresh room details to see updates
- Leave the room at any time

## API Integration

The frontend communicates with the backend through:

- **REST API**: For room creation, joining, and status updates
- **Socket.IO**: For real-time updates (future implementation)

### API Endpoints Used

- `POST /api/create-room` - Create a new room
- `POST /api/join-room` - Join an existing room
- `GET /api/room/:roomCode` - Get room details
- `POST /api/start-game` - Start the game (host only)

## State Management

The app uses Zustand for state management with the following store:

- `user` - Current user information
- `room` - Current room details
- `roomCode` - Active room code
- `loading` - Loading states
- `error` - Error messages

## Components

- **Homepage**: Main landing page with navigation options
- **CreateRoom**: Form to create a new game room
- **JoinRoom**: Form to join an existing room
- **GetRoom**: Room details and management interface

## Styling

- Bootstrap 5 for responsive design
- Custom CSS for game-specific styling
- Toast notifications for user feedback

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── homepage.jsx
│   ├── createroom.jsx
│   ├── joinroom.jsx
│   ├── getroom.jsx
│   └── styles/         # Component-specific CSS
├── lib/                # Utility libraries
│   └── axios.js        # API configuration
├── store/              # State management
│   └── auth.store.js   # Zustand store
├── App.jsx             # Main app component
└── main.jsx            # App entry point
```

## Troubleshooting

### Common Issues

1. **Cannot connect to backend**: Ensure the backend server is running on port 5000
2. **Room not found**: Check if the room code is correct and the room still exists
3. **Join room fails**: Ensure the room isn't full (max 4 players) and your name isn't already taken

### Error Handling

- All API errors are displayed as toast notifications
- Loading states prevent multiple simultaneous requests
- Form validation ensures required fields are filled

## Future Enhancements

- Real-time updates with Socket.IO
- Game logic implementation
- Player avatars and profiles
- Game history and statistics
- Mobile app version