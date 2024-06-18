import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
// import { Link } from "react-router-dom";

const Room = ({ clearRoomCode }) => {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(params.roomCode);
    const getRoomDetails = async () => {
      const response = await fetch(`/api/get-room?code=${params.roomCode}`);
      if (!response.ok) {
        clearRoomCode();
        navigate("/");
      }
      const result = await response.json();
      console.log(result);
      setVotesToSkip(result.votes_to_skip);
      setGuestCanPause(result.guest_can_pause);
      setIsHost(result.is_host);
    };
    getRoomDetails();
  }, []);

  const handleLeaveRoom = async () => {
    try {
      const response = await fetch("/api/leave-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);
      if (response.ok) {
        clearRoomCode();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {params.roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {isHost.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="error" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};
export default Room;
