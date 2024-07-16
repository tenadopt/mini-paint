import React from 'react';
import {Button} from "@mui/material";
import {signOut} from "features/auth/model/authSlice";
import {useAppDispatch} from "shared/hooks/hooks";


const LogoutButton = () => {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(signOut())
    }

    return (
        <Button variant="outlined" color="secondary" onClick={handleLogout}>Logout</Button>
    );
};

export default LogoutButton;