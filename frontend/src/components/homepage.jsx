import React from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';  // Import the CSS file

const Homepage = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate('/create-room');
  };

  const handleJoinRoom = () => {
    navigate('/join-room');
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center game-container">
      <div className="container-fluid px-4 py-5">
        {/* Title Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-4 game-title">
            Welcome to Raja Mantri
          </h1>
          <hr className="mx-auto mb-4 game-divider" />
          <p className="fw-semibold game-subtitle">
            Select an option from the menu to get started
          </p>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <button
            className="btn btn-game-warning"
            onClick={handleCreateRoom}
           style={{backgroundColor:'yellow'}}>
            Create Room
          </button>
          <button
            className="btn btn-game-success"
            onClick={handleJoinRoom}
           style={{backgroundColor:'lightgreen'}}>
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
