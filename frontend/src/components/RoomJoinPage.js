import React from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value);
  };

  const roomButtonPressed = async () => {
    try {
      const response = await fetch("/api/join-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: roomCode,
        }),
      });

      if (response.ok) {
        window.location.href = `/room/${roomCode}`;
      } else {
        setError("Room not found.");
      }
    } catch (error) {
      console.log(error);
    }
    const data = await response.json();
    console.log(data);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={error}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={(e) => handleTextFieldChange(e)}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => roomButtonPressed(e)}
        >
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Link to="/">
          <Button variant="contained" color="secondary">
            Back
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
}
