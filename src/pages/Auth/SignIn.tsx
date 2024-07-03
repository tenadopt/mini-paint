import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn } from './authSlice';
import { AppDispatch } from '../../app/store';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(signIn({ email, password }))
            .unwrap()
            .then(() => {
                navigate('/gallery');
            })
            .catch((error) => {
                console.error('Failed to sign in: ', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <Button type="submit">Sign In</Button>
        </form>
    );
};

export default SignIn;
