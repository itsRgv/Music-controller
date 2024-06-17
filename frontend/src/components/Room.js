import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";

const Room = () => {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const params = useParams();

  useEffect(() => {
    console.log(params.roomCode);
    const getRoomDetails = async () => {
      const response = await fetch(`/api/get-room?code=${params.roomCode}`);
      if (!response.ok) {
        window.location.href("/create-room");
      }
      const result = await response.json();
      console.log(result);
      setVotesToSkip(result.votes_to_skip);
      setGuestCanPause(result.guest_can_pause);
      setIsHost(result.is_host);
    };
    getRoomDetails();
  }, []);

  return (
    <div>
      <h1>{params.roomCode}</h1>
      <p>Votes Required : {votesToSkip.toString()}</p>
      <p>Guest Can Pause? : {guestCanPause.toString()}</p>
      <p>Host: {isHost.toString()}</p>
    </div>
  );
};
export default Room;
