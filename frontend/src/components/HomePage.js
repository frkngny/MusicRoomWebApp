import React,  { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import InfoPage from "./InfoPage";

const HomePage = () => {
    const params = useParams();

    function leaveRoomButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('/api/leave-room', requestOptions).then((_resp) => {
            window.location.reload();
        });
    }

    const renderJoinBack = (roomCode) => {
        return (
            <Grid item xs={12} class="popup-join">
                <p>It seems you have left a room (<b>{roomCode}</b>). Do you want to join back?</p>
                <Button color="primary" variant="contained" to={`/room/${roomCode}`} component={ Link }>Join</Button>
                <Button color="secondary" variant="contained" onClick={leaveRoomButtonPressed}>Leave</Button>
            </Grid>
        );
    }

    function renderHomePage() {
        const [roomCode, setRoomCode] = useState(null);
        
        useEffect(() => {
            fetch('/api/user-in-room').then((resp) => resp.json()).then((data) => { if (data.code){ setRoomCode(data.code); } });
        });
        
        return(
            <Grid container spacing={3} align="center">
                <Grid item xs={12}>
                    <Typography variant="h3" component="h3">Music Party</Typography>
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" variant="contained" to="/join" component={ Link }>Join A Room</Button>
                        <Button color="secondary" variant="contained" to="/create" component={ Link }>Create A Room</Button>
                        <Button color="grey" variant="contained" to="/info" component={ Link }>Info</Button>
                    </ButtonGroup>
                </Grid>
                {roomCode ? renderJoinBack(roomCode) : null}
            </Grid>
        );
    }

    return (
        <Router>
            <Routes>
                <Route exact path='/' element={renderHomePage()}/>
                <Route path='/join' element={<RoomJoinPage/>}/>
                <Route path='/create' element={<CreateRoomPage update={false} votesToSkip={2} guestCanPause={true}/>}/>
                <Route path='/info' element={<InfoPage/>}/>
                <Route path='/room/:roomCode' element={<Room/>} />
            </Routes>
        </Router>
    );
    
}
export default HomePage;
//