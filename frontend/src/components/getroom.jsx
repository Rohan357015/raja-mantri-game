import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

const GetRoom = () => {
  const navigate = useNavigate();
  const { room, roomCode, user, loading, getRoom, startGame, clearRoom } = useAuthStore();
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    if (roomCode && !room) {
      fetchRoomDetails();
    }
  }, [roomCode]);

  const fetchRoomDetails = async () => {
    if (!roomCode) return;
    
    setRefreshLoading(true);
    try {
      await getRoom(roomCode);
    } catch (error) {
      // Error is handled in the store
    } finally {
      setRefreshLoading(false);
    }
  };
 
  const handleStartGame = async () => {
    if (!roomCode || !user) return;
    navigate('/start-game');
    
    try {
      await startGame(roomCode, user.user);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleLeaveRoom = () => {
    clearRoom();
    navigate('/');
  };

  const handleRefresh = () => {
    fetchRoomDetails();
  };

  if (loading || refreshLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center game-container">
        <div className="container-fluid px-4 py-5 text-center">
          <h1 className="fw-bold mb-4 game-title">Room Not Found</h1>
          <p className="mb-4">Unable to load room details.</p>
          <button className="btn-game-warning" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isHost = user?.isHost;
  const canStartGame = isHost && room.players.length >= 4 && room.status === 'waiting';

  return (
    <div className="d-flex flex-column justify-content-center align-items-center game-container">
      <div className="container-fluid px-4 py-5">
        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-4 game-title">Room Details</h1>
          <hr className="mx-auto game-divider" />
        </div>

        {/* Room Info Card */}
        <div className="d-flex justify-content-center mb-5">
          <div className="p-5 form-bg" style={{ minWidth: '500px' }}>
            <h2 className="text-center text-success mb-4 fs-2 fw-bold">Room: {room.roomCode}</h2>
            
            {/* Room Status */}
            <div className="mb-4">
              <h5 className="text-light">Status: 
                <span className={`ms-2 badge ${room.status === 'waiting' ? 'bg-warning' : 'bg-success'}`}>
                  {room.status.toUpperCase()}
                </span>
              </h5>
            </div>

            {/* Room Details */}
            <div className="mb-4">
              <p className="text-light"><strong>Host:</strong> {room.hostName}</p>
              <p className="text-light"><strong>Rounds:</strong> {room.round}</p>
              <p className="text-light"><strong>Players:</strong> {room.players.length}/{room.maxPlayers}</p>
            </div>

            {/* Players List */}
            <div className="mb-4">
              <h5 className="text-light mb-3">Players:</h5>
              <div className="list-group">
                {room.players.map((player, index) => (
                  <div key={index} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-light border-secondary">
                    <span>{player.name} {player.isHost && <span className="badge bg-primary ms-2">Host</span>}</span>
                    <small className="text-muted">
                      Joined: {new Date(player.joinedAt).toLocaleTimeString()}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              {canStartGame && (
                <button 
                  className="btn-game-success me-3"
                  onClick={handleStartGame}
                  disabled={loading}
                >
                  {loading ? 'Starting...' : 'Start Game'}
                </button>
              )}
              
              <button 
                className="btn-game-warning me-3"
                onClick={handleRefresh}
                disabled={refreshLoading}
              >
                {refreshLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button 
                className="btn btn-outline-danger"
                onClick={handleLeaveRoom}
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>

        {/* Room Code Display */}
        <div className="text-center mb-5">
          <div className="text-warning d-inline-block room-code">
            <p className="fs-4 fw-bold">Room Code: {room.roomCode}</p>
            <p className="text-light">Share this code with other players to join!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetRoom;
