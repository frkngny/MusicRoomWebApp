import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { Grid, Typography, IconButton, Card, LinearProgress } from "@material-ui/core";
import { PlayArrow, SkipNext, Pause } from "@material-ui/icons";

const MusicPlayer = () => {
    const [state, setState] = useState({
        isHost: false,
        spotifyAuthenticated: false,
        song: {}
    });

    var interval= null;

    useEffect(() => {
        interval = setInterval(getCurrentSong, 1000);
    }, []);

    useEffect(() => {
        return () => {
            clearInterval(interval);
        }
    }, [])

    function getCurrentSong(){
        fetch('/spotify/current-song').then((r) => {
            if(!r.ok)
                return {};
            return r.json();
        }).then((dt) => {
            setState((state) => {
                return {
                    isHost: state.isHost,
                    spotifyAuthenticated: state.spotifyAuthenticated,
                    song: dt
                };
            });
        });
    }

    function pauseSong() {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        };
        fetch('/spotify/pause-song', requestOptions);
    }
    function playSong() {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        };
        fetch('/spotify/play-song', requestOptions);
    }
    function skipSong() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        };
        fetch('/spotify/skip-song', requestOptions);
    }

    const props = state.song;
    const songProgress = (props.time / props.duration) * 100 ;

    let secondP = Math.floor(props.time / 1000);
    let minuteP = Math.floor(secondP / 60);
    secondP = secondP % 60;
    minuteP = minuteP % 60;
    return (
        <Card>
            <Grid container alignItems='center'>
                <Grid item align="center" xs={4}>
                    <img src={props.image_url} height="100%" width="100%"/>
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant='h5'>
                        { props.title }
                    </Typography>
                    <Typography color="textSecondary" variant='subtitle1'>
                        { props.artist }
                    </Typography>
                    <div>
                        <IconButton onClick={ () => { props.is_playing ? pauseSong() : playSong() } }>
                            {props.is_playing ? <Pause /> : <PlayArrow/>}
                        </IconButton>
                        <IconButton onClick={() => skipSong()}>
                            {props.votes} / {props.votes_required}
                            <SkipNext/>
                        </IconButton>
                    </div>
                    <p>{minuteP + ":" +  secondP}</p>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress}/>
        </Card>
    );
}
export default MusicPlayer;