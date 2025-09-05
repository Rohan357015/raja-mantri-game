import React from 'react';
import { useNavigate } from 'react-router-dom';
import './joinroom.css';

const JoinRoom = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate('/');
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center game-container">
      <div className="container-fluid px-4 py-5">
        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-4 game-title">Raja Mantri</h1>
          <hr className="mx-auto game-divider" />
        </div>

        {/* Form */}
        <div className="d-flex justify-content-center mb-5">
          <form className="p-5 form-bg">
            <h2 className="text-center text-success mb-4 fs-2 fw-bold">Join Room</h2>

            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="playerName" className="form-label fw-semibold text-light fs-5 mb-3">
                Player Name:
              </label>
              <input
                type="text"
                id="playerName"
                className="form-control game-input"
                placeholder="Enter your name"
              />
            </div>

            {/* Room Code Input */}
            <div className="mb-5">
              <label htmlFor="roomCode" className="form-label fw-semibold text-light fs-5 mb-3">
                Room Code:
              </label>
              <input
                type="text"
                id="roomCode"
                className="form-control game-input"
                placeholder="Enter room code"
              />
            </div>

            {/* Join Room Button */}
            <div className="text-center">
              <button type="submit" className=" btn-game-success">
                Join Room
              </button>
            </div>
          </form>
        </div>

        {/* Create Room Section */}
        <div className="text-center">
          <p className="fw-semibold section-divider">Want to create a new room?</p>
          <button className=" btn-game-warning" onClick={handleCreateRoom}>
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
