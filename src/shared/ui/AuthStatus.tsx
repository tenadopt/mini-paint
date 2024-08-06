import React from 'react';
import { useAppSelector } from 'shared/hooks/hooks';

const AuthStatus = () => {
    const auth = useAppSelector((state) => state.auth);

    if (!auth.userId || !auth.email) {
        return null;
    }

    return (
        <div>
            Logged in as {auth.email}
        </div>
    );
};

export default AuthStatus;