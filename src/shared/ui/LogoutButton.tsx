// src/shared/ui/LogoutButton.tsx

import React from 'react';
import { Button } from '@mui/material';
import { useAppDispatch } from 'shared/hooks/hooks';
import { signOut } from 'features/auth/model/authSlice';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(signOut());
        navigate('/');
    };

    return (
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default LogoutButton;