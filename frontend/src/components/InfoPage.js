import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import { NavigateBeforeRounded, NavigateNextRounded } from "@material-ui/icons";
import { Link, useNavigate, useParams } from 'react-router-dom';


const pages = {
    JOIN: "pages.join",
    CREATE: "pages.create",
};

const InfoPage = (props) => {
    const [page, setPage] = useState(pages.JOIN);

    function joinInfo(){
        return "Join page";
    }
    function createInfo(){
        return "Create page";
    }

    useEffect(() => {
        console.log("ran");
        return () => console.log("cleanup");
    });

    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <Typography component="h4" variant="h4">
                    What is Music Room?
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1">
                    {page === pages.JOIN ? joinInfo() : createInfo()}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <IconButton onClick={() => {page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE)}}>
                    {page === pages.CREATE ? <NavigateNextRounded/> : <NavigateBeforeRounded/>}
                </IconButton>
            </Grid>
            <Grid item xs={12}>
                <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
            </Grid>
        </Grid>
    );
}
export default InfoPage;

