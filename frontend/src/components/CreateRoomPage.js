import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";


const CreateRoomPage = (props) => {
    const params = useParams();
    
    const [state, setState] = useState({
        votesToSkip: props.votesToSkip,
        guestCanPause: props.guestCanPause,
    });
    const [defaultVotes, setDefaultVotes] = useState(props.votesToSkip);

    /*useEffect(() => {
        if(props.update){
            setDefaultVotes(props.votesToSkip);
            setState((state) => {state.votesToSkip= props.votesToSkip, state.guestCanPause= props.guestCanPause});
        }
    },[]);*/

    const navigate = useNavigate();

    function handleVotesChange(e) {
        state.votesToSkip =  e.target.value;
    }

    function handleGuestCanPauseChange(e) {
        state.guestCanPause = e.target.value === "true" ? true : false;
    }

    function handleRoomButtonPressed(e) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: state.votesToSkip,
                guest_can_pause: state.guestCanPause,
            }),
        };

        fetch('/api/create-room', requestOptions).then((resp) => resp.json()).then((data) => navigate("/room/" + data.code));
    }

    const renderBackButton = () => {
        return (
        <Grid item xs={12}>
            <Button color="grey" variant="contained" to="/" component={Link}>Back</Button>
        </Grid>
        );
    }

    return (<Grid container spacing={2} align="center">
        <Grid item xs={12}>
            <Typography component="h4" variant="h4">
                {props.update ? "Update the room." : "Create a room."}
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <FormControl>
                <FormHelperText>
                    <div align="center">
                        Guest Control of Playback State
                    </div>
                </FormHelperText>
                <RadioGroup row defaultValue={""+state.guestCanPause} onChange={handleGuestCanPauseChange}>
                    <FormControlLabel value="true" control={<Radio color="primary" />} label="Play/Pause" labelPlacement="bottom" />
                    <FormControlLabel value="false" control={<Radio color="secondary" />} label="No Control" labelPlacement="bottom" />
                </RadioGroup>
            </FormControl>
        </Grid>
        <Grid item xs={12}>
            <FormControl>
                <TextField required={true} type="number" defaultValue={defaultVotes} inputProps={{ min: 1, style: { textAlign: "center" } }} onChange={handleVotesChange} />
                <FormHelperText>
                    <div align="center">Votes required to skip the song.</div>
                </FormHelperText>
            </FormControl>
        </Grid>
        <Grid item xs={12}>
            <Button color="primary" variant="contained" onClick={() => handleRoomButtonPressed()}>{props.update ? "Update" : "Create"}</Button>
        </Grid>
        {props.update ? null : renderBackButton()}
        
    </Grid>);
}
export default CreateRoomPage;


/*
export default class CreateRoomPage extends Component {
    defaultVotes = 2;
    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes,
        };
        
    }

    handleVotesChange = (e) => {
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    handleGuestCanPauseChange = (e) => {
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        });
    }

    handleRoomButtonPressed = (e) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),
        };
        
        fetch('/api/create-room', requestOptions).then((resp) => resp.json()).then((data) => navigate("/room/" + data.code, { replace: true }));
    }

    render() {
        return <Grid container spacing={2}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create a room.
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <FormHelperText>
                        <div align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue="true" onChange={this.handleGuestCanPauseChange}>
                        <FormControlLabel value="true" control={<Radio color="primary" />} label="Play/Pause" labelPlacement="bottom" />
                        <FormControlLabel value="false" control={<Radio color="secondary" />} label="No Control" labelPlacement="bottom" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField required={true} type="number" defaultValue={this.defaultVotes} inputProps={{ min: 1, style: { textAlign: "center" } }} onChange={this.handleVotesChange} />
                    <FormHelperText>
                        <div align="center">Votes required to skip the song.</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}>Create A Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="grey" variant="contained" to="/" component={Link}>Back</Button>
            </Grid>
        </Grid>;
    }
}*/