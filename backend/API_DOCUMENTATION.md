# Raja Mantri Game API Documentation

## Room Management System

This API allows players to create and join game rooms with a maximum of 4 players. The system supports both REST API endpoints and real-time Socket.IO events for live updates.

## Socket.IO Events

### Client to Server Events

#### 1. Create Room
**Event:** `create-room`
**Data:**
```json
{
  "name": "Player Name",
  "round": 5
}
```
**Response:** `room-created` event

#### 2. Join Room
**Event:** `join-room`
**Data:**
```json
{
  "roomCode": "ABC123",
  "playerName": "New Player Name"
}
```
**Response:** `joined-room` event + `room-updated` broadcast

#### 3. Get Room Details
**Event:** `get-room`
**Data:**
```json
{
  "roomCode": "ABC123"
}
```
**Response:** `room-details` event

#### 4. Start Game
**Event:** `start-game`
**Data:**
```json
{
  "roomCode": "ABC123",
  "userId": "host_user_id"
}
```
**Response:** `game-started` broadcast

#### 5. Leave Room
**Event:** `leave-room`
**Data:**
```json
{
  "roomCode": "ABC123",
  "playerName": "Player Name"
}
```
**Response:** `left-room` event + `room-updated` broadcast

### Server to Client Events

#### 1. Room Created
**Event:** `room-created`
**Data:**
```json
{
  "message": "Room created successfully",
  "room": {
    "roomCode": "ABC123",
    "hostName": "Player Name",
    "round": 5,
    "players": [...],
    "maxPlayers": 4,
    "status": "waiting"
  }
}
```

#### 2. Room Updated
**Event:** `room-updated`
**Data:**
```json
{
  "roomCode": "ABC123",
  "hostName": "Player Name",
  "round": 5,
  "players": [...],
  "maxPlayers": 4,
  "status": "waiting",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### 3. Game Started
**Event:** `game-started`
**Data:**
```json
{
  "message": "Game started successfully",
  "room": {
    "roomCode": "ABC123",
    "hostName": "Player Name",
    "round": 5,
    "players": [...],
    "maxPlayers": 4,
    "status": "playing",
    "startedAt": "2024-01-01T00:05:00.000Z"
  }
}
```

#### 4. Error
**Event:** `error`
**Data:**
```json
{
  "message": "Error description"
}
```

## REST API Endpoints

### Endpoints

#### 1. Create Room
**POST** `/create-room`

Creates a new room with the host's name and round selection.

**Request Body:**
```json
{
  "name": "Player Name",
  "round": 5
}
```

**Response:**
```json
{
  "message": "Room created successfully",
  "room": {
    "roomCode": "ABC123",
    "hostName": "Player Name",
    "round": 5,
    "players": [
      {
        "user": "user_id",
        "name": "Player Name",
        "joinedAt": "2024-01-01T00:00:00.000Z",
        "isHost": true
      }
    ],
    "maxPlayers": 4,
    "status": "waiting"
  }
}
```

#### 2. Join Room
**POST** `/join-room`

Allows other players to join an existing room using the room code.

**Request Body:**
```json
{
  "roomCode": "ABC123",
  "name": "New Player Name"
}
```

**Response:**
```json
{
  "message": "Successfully joined room",
  "room": {
    "roomCode": "ABC123",
    "hostName": "Player Name",
    "round": 5,
    "players": [
      {
        "user": "user_id_1",
        "name": "Player Name",
        "joinedAt": "2024-01-01T00:00:00.000Z",
        "isHost": true
      },
      {
        "user": "user_id_2",
        "name": "New Player Name",
        "joinedAt": "2024-01-01T00:01:00.000Z",
        "isHost": false
      }
    ],
    "maxPlayers": 4,
    "status": "waiting"
  }
}
```

#### 3. Get Room Details
**GET** `/room/:roomCode`

Retrieves the current state of a room.

**Response:**
```json
{
  "room": {
    "roomCode": "ABC123",
    "hostName": "Player Name",
    "round": 5,
    "players": [...],
    "maxPlayers": 4,
    "status": "waiting",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. Start Game
**POST** `/start-game`

Allows the host to start the game when ready.

**Request Body:**
```json
{
  "roomCode": "ABC123",
  "userId": "host_user_id"
}
```

**Response:**
```json
{
  "message": "Game started successfully",
  "room": {
    "roomCode": "ABC123",
    "hostName": "Player Name",
    "round": 5,
    "players": [...],
    "maxPlayers": 4,
    "status": "playing",
    "startedAt": "2024-01-01T00:05:00.000Z"
  }
}
```

### Features

- **Room Code Generation**: Each room gets a unique 6-character uppercase code
- **Maximum Players**: Rooms are limited to 4 players
- **Round Selection**: Host can choose 1-10 rounds
- **Name Validation**: Prevents duplicate names within the same room
- **Host Controls**: Only the host can start the game
- **Room Status**: Tracks waiting, playing, and finished states
- **Player Management**: Tracks who joined when and their role

### Error Handling

The API returns appropriate HTTP status codes and error messages for:
- Missing required fields (400)
- Invalid round numbers (400)
- Room not found (404)
- Room full (400)
- Name already taken (400)
- Unauthorized actions (403)
- Server errors (500)

### Usage Flow

1. **Host creates room**: POST `/create-room` with name and round
2. **Host shares room code**: The generated room code is shared with other players
3. **Players join**: POST `/join-room` with room code and player name
4. **Check room status**: GET `/room/:roomCode` to see current players
5. **Start game**: POST `/start-game` when ready (host only)
