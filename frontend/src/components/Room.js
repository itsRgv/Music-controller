import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
// import { Link } from "react-router-dom";

const Room = ({ clearRoomCode }) => {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(params.roomCode);
    getRoomDetails();
  }, []);

  const getRoomDetails = async () => {
    const response = await fetch(`/api/get-room?code=${params.roomCode}`);
    if (!response.ok) {
      clearRoomCode();
      navigate("/");
    }
    const result = await response.json();
    // console.log(result);
    setVotesToSkip(result.votes_to_skip);
    setGuestCanPause(result.guest_can_pause);
    setIsHost(result.is_host);
    if (result.is_host) {
      // console.log("hi");
      authenticateSpotify();
    }
  };

  const authenticateSpotify = async () => {
    // console.log("hi");
    const response = await fetch("/spotify/is-authenticated");
    const data = await response.json();

    setSpotifyAuthenticated(data.status);
    console.log(data.status);
    if (!data.status) {
      const response = await fetch("/spotify/get-auth-url");
      const data = await response.json();
      window.location.replace(data.url);
    }
  };

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

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  if (showSettings) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votes_to_skip={votesToSkip}
            guest_can_pause={guestCanPause}
            room_code={params.roomCode}
            updateCallback={() => getRoomDetails()}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            type="button"
            variant="contained"
            color="error"
            onClick={() => setShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }
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
      {isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="error"
          onClick={() => handleLeaveRoom()}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};
export default Room;
