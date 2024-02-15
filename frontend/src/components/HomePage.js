import React,  { useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';


const HomePage = () => {
    const [roomCode, setRoomCode] = useState(null);
    useEffect(() => {
        console.log(roomCode);
        fetch('/api/user-in-room').then((resp) => resp.json()).then((data) => { setRoomCode(data.code); });
        console.log(roomCode);
    });
    
    function renderHomePage() {
        if(roomCode)
            return(
                <Grid container spacing={3} align="center">
                    <Grid item xs={12}>
                        <Typography variant="h3" component="h3">Music Party</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ButtonGroup disableElevation variant="contained" color="primary">
                            <Button color="primary" variant="contained" to="/join" component={ Link }>Join A Room</Button>
                            <Button color="secondary" variant="contained" to="/create" component={ Link }>Create A Room</Button>
                        </ButtonGroup>
                    </Grid>
                    <br/>
                    <Grid item xs={12} class="popup-join">
                        <p>It seems you have left a room (<b>{roomCode}</b>). Do you want to join back?</p>
                        <Button color="primary" variant="contained" to={`/room/${roomCode}`} component={ Link }>Join</Button>
                    </Grid>
                </Grid>
            );
        return(
            <Grid container spacing={3} align="center">
                <Grid item xs={12}>
                    <Typography variant="h3" component="h3">Music Party</Typography>
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" variant="contained" to="/join" component={ Link }>Join A Room</Button>
                        <Button color="secondary" variant="contained" to="/create" component={ Link }>Create A Room</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }
    
    return (
        <Router>
            <Routes>
                <Route exact path='/' element={renderHomePage()}/>
                <Route path='/join' element={<RoomJoinPage/>}/>
                <Route path='/create' element={<CreateRoomPage/>}/>
                <Route path='/room/:roomCode' element={<Room/>}/>
            </Routes>
        </Router>
    );
    
}
export default HomePage;