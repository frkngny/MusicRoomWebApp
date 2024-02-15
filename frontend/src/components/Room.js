import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


const Room = () => {
    const params = useParams();
    const [state, setState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false
    });

    useEffect(() => fetch('/api/get-room?code=' + params.roomCode).then((resp) => resp.json()).then((data) => {
        setState({
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            isHost: data.is_host
        })
    }), []);

    return (<div>
        <h3>{params.roomCode}</h3>
        <p>Votes: {state.votesToSkip}</p>
        <p>Guest Can Pause: {""+state.guestCanPause}</p>
        <p>Host: {""+state.isHost}</p>
    </div>);
}

export default Room;
