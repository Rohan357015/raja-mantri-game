import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/createroom.css';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';
import{useState,useEffect} from 'react';

const CreateRoom = () => {
  const navigate = useNavigate();
  const { createRoom, roomCode } = useAuthStore();
  const [round, setRound] = useState();
  const [name , setName] = useState("");



  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!name || !round) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createRoom({ name, round: parseInt(round) });
      navigate('/get-room');
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleJoinRoom = () => {
    navigate('/join-room');
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
          <form className="p-5 form-bg" onSubmit={handleCreateRoom}>
            <h2 className="text-center text-success mb-4 fs-2 fw-bold">Create Room</h2>

            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="Name" className="form-label fw-semibold text-light fs-5 mb-3">
                Player Name:
              </label>
              <input type="text" id="Name" className="form-control game-input" placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Round Input */}
            <div className="mb-5">
              <label htmlFor="Round" className="form-label fw-semibold text-light fs-5 mb-3">
                Number of Rounds:
              </label>
              <input type="number" id="Round" className="form-control game-input" placeholder="Number of rounds" min="1" max="20"
              value={round}
              onChange={(e) => setRound(e.target.value)}
              />
            </div>

            {/* Create Room Button */}
            <div className="text-center">
              <button type="submit" className=" btn-game-warning">Create Room</button>
            </div>
          </form>
        </div>

        {/* Room Code */}
        <div className="text-center mb-5">
          <div className="text-warning d-inline-block room-code">
            {roomCode && <p className="fs-4 fw-bold">Room Code: {roomCode}</p>}
          </div>
        </div>

        {/* Join Room Section */}
        <div className="text-center">
          <p className="fw-semibold section-divider">Already have a room code?</p>
          <button className=" btn-game-success" onClick={handleJoinRoom}>
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
