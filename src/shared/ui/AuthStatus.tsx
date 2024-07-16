import React from "react";
import {RootState} from "app/store";
import {selectAuth} from "features/auth/model/authSlice";
import {CircularProgress, Typography} from "@mui/material";
import {useAppSelector} from "shared/hooks/hooks";

const AuthStatus = () => {
    const { userId, loading, error} = useAppSelector((state: RootState) => selectAuth(state));

    if (loading) {
        return <CircularProgress/>
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <Typography variant="body1">
            {userId ? `Logged in as: ${userId}` : 'Not logged in'}
        </Typography>
    )

}

export default AuthStatus;