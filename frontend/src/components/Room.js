import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";


const Room = () => {
    const params = useParams();
    const [state, setState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings: false,
    });
    const navigate = useNavigate();

    useEffect(() => fetch('/api/get-room?code=' + params.roomCode)
    .then((resp) => {
        if(!resp.ok){
            navigate('/');
        }
        return resp.json();
    }).then((data) => {
        setState({
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            isHost: data.is_host,
            showSettings: false,
        })
    }), []);

    function leaveRoomButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('/api/leave-room', requestOptions).then((_resp) => {
            navigate('/');
        });
    }

    const updateShowSettings = (value) => {
        setState({
            votesToSkip: state.votesToSkip,
            guestCanPause: state.guestCanPause,
            isHost: state.isHost,
            showSettings: value,
        })
    }

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12}>
                <Button variant="contained" color="grey" onClick={() => updateShowSettings(true)}>Settings</Button>
            </Grid>
        );
    }

    const renderSettings = () => {
        return (
        <Grid container spacing={2} align="center">
            <Grid item xs={12}>
                <CreateRoomPage update={true} votesToSkip={state.votesToSkip} guestCanPause={state.guestCanPause} roomCode={params.roomCode} updateCallback={() => {}}/>
            </Grid>
            <Grid item xs={12}>
                <Button color="secondary" variant="contained" onClick={() => updateShowSettings(false)}>Close</Button>
            </Grid>
        </Grid>);
    }

    if(state.showSettings){
        return renderSettings();
    }

    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">Code: {params.roomCode}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">Votes: {state.votesToSkip}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">Guest Can Pause: {""+state.guestCanPause}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">Host: {""+state.isHost}</Typography>
            </Grid>
            {state.isHost ? renderSettingsButton() : null}
            <Grid item xs={12}>
                <Button color="secondary" variant="contained" onClick={leaveRoomButtonPressed}>Leave</Button>
            </Grid>
        </Grid>
    );
}

export default Room;