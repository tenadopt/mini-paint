import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../pages/Auth/authSlice';

const UserProfile: React.FC = () => {
    const user = useSelector(selectUser);

    return (
        <div>
            <h2>User Profile</h2>
            {user ? (
                <div>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>No user logged in</p>
            )}
        </div>
    );
};

export default UserProfile;
