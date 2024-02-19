import React, { useState, useEffect } from "react";
import { Button, TextField, Grid, Typography } from "@material-ui/core";
import { Link, useNavigate, useParams } from "react-router-dom";


const RoomJoinPage = () => {
    const [state, setState] = useState({
        roomCode: "",
        error: "",
    });
    const navigate = useNavigate();


    function handleTextFieldChange(e) {
        setState((state) => {
            return {
                roomCode: e.target.value,
                error: state.error
            }
        });
    }

    function handleJoinButtonPressed(e) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: state.roomCode,
            }),
        };

        fetch('/api/join-room', requestOptions).then((resp) => {
            if(resp.ok){ navigate(`/room/${state.roomCode}`); }
            else{ setState({roomCode: state.roomCode, error: "Room not found."}); }
        }).catch((error) => { console.log(error); });
    }

    return (<Grid container spacing={2} align="center">
        <Grid item xs={12} >
            <Typography variant="h4" component="h4">
                Join a Room
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <TextField error={state.error} label="Code" placeholder="Enter a Room code" value={state.roomCode} helperText={state.error} variant="outlined" onChange={handleTextFieldChange}/>
        </Grid>
        <Grid item xs={12}>
            <Button color="primary" variant="contained" onClick={handleJoinButtonPressed}>Join Room</Button>
        </Grid>
        <Grid item xs={12}>
            <Button color="grey" variant="contained" to="/" component={Link}>Back</Button>
        </Grid>
    </Grid>);
}

export default RoomJoinPage;