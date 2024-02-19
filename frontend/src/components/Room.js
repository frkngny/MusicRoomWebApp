import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";



/*const componentWillMount = () => {
    useEffect( () => {
       // componentwillmount in functional component.
       // Anything in here is fired on component mount.
    }, []);
 }*/

/*const componentWillUnmount = () =>{
    useEffect(() => {
        return () => {
            
        }
    }, [])
} */

const Room = () => {
    const params = useParams();
    const [state, setState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings: false,
        spotifyAuthenticated: false,
        song: {}
    });

    const navigate = useNavigate();
    //var interval= null;

    useEffect(() => fetch('/api/get-room?code=' + params.roomCode).then((resp) => {
        if(!resp.ok){
            navigate('/');
        }
        return resp.json();
    }).then((data) => {
        if(data.is_host){
            authenticateSpotify();
        }
        setState((state) => {
            return {
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
                showSettings: state.showSettings,
                spotifyAuthenticated: state.spotifyAuthenticated,
                song: state.song
            };
        });
    }), []);

    /*useEffect(() => {
        interval = setInterval(getCurrentSong, 2000);
    }, []);

    useEffect(() => {
        return () => {
            clearInterval(interval);
        }
    }, [])*/
    
    function authenticateSpotify() {
        fetch('/spotify/is-authenticated').then((resp) => resp.json()).then((data) => {
            if (!data.is_authenticated){
                fetch('/spotify/get-auth-url').then((resp) => resp.json()).then((data) => {
                    window.location.replace(data.url);
                });
            }
            setState((state) => {
                return {
                    votesToSkip: state.votesToSkip,
                    guestCanPause: state.guestCanPause,
                    isHost: state.isHost,
                    showSettings: state.showSettings,
                    spotifyAuthenticated: data.is_authenticated,
                    song: state.song
                };
            });
        });
    }

    /*function getCurrentSong(){
        fetch('/spotify/current-song').then((r) => {
            if(!r.ok)
                return {};
            return r.json();
        }).then((dt) => {
            setState((state) => {
                return {
                    votesToSkip: state.votesToSkip,
                    guestCanPause: state.guestCanPause,
                    isHost: state.isHost,
                    showSettings: state.showSettings,
                    spotifyAuthenticated: state.spotifyAuthenticated,
                    song: dt
                };
            });
        });
    }*/

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
        setState((state) => {
            return {
                votesToSkip: state.votesToSkip,
                guestCanPause: state.guestCanPause,
                isHost: state.isHost,
                showSettings: value,
                spotifyAuthenticated: state.spotifyAuthenticated,
                song: state.song
            };
        });
        if (!value)
            window.location.reload();
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
            <MusicPlayer />
            {state.isHost ? renderSettingsButton() : null}
            <Grid item xs={12}>
                <Button color="secondary" variant="contained" onClick={leaveRoomButtonPressed}>Leave</Button>
            </Grid>
        </Grid>
    );
}

export default Room;