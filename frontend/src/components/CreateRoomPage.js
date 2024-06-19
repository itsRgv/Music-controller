import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
// import { create } from "@mui/material/styles/createTransitions";
import { Collapse } from "@mui/material";
import Alert from "@mui/material/Alert";

export default function CreateRoomPage({
  update = false,
  votes_to_skip = 2,
  guest_can_pause = true,
  room_code = null,
  updateCallback = () => {},
}) {
  // CreateRoomPage.defaultProps = {
  //   votes_to_skip: 2,
  //   guest_can_pause: true,
  //   update: false,
  //   room_code: null,
  //   updateCallback: () => {},
  // };

  const navigate = useNavigate();

  const [guestCanPause, setGuestCanPause] = useState(guest_can_pause);
  const [votesToSkip, setVotesToSkip] = useState(votes_to_skip);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleGuestCanPauseChange = (e) => {
    // console.log(e.target.value);
    setGuestCanPause(e.target.value === "true" ? true : false);
  };

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleRoomButtonPressed = async () => {
    // console.log("hi");
    const response = await fetch("/api/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    });
    const data = await response.json();
    // console.log(data);
    navigate(`/room/${data.code}`);
  };

  const handleUpdateButtonPressed = async () => {
    // console.log({ votesToSkip, guestCanPause });
    const response = await fetch("/api/update-room", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: room_code,
      }),
    });
    if (response.ok) {
      setSuccessMsg("Room Updated Successfully");
    } else {
      setErrorMsg("Error Updating Room");
    }
    updateCallback();
  };

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleRoomButtonPressed()}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Link to="/">
            <Button color="secondary" variant="contained">
              Back
            </Button>
          </Link>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={() => handleUpdateButtonPressed()}
        >
          Update Room
        </Button>
      </Grid>
    );
  };
  // console.log(guestCanPause);
  const title = update ? "Update Room" : "Create A Room";
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg != "" || successMsg != ""}>
          {successMsg != "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setSuccessMsg("");
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMsg("");
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause.toString()}
            onChange={(e) => handleGuestCanPauseChange(e)}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="error" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={(e) => handleVotesChange(e)}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
}
