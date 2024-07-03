import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp } from './authSlice';
import { AppDispatch } from '../../app/store';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(signUp({ email, password }))
            .unwrap()
            .then(() => {
                navigate('/gallery');
            })
            .catch((error) => {
                console.error('Failed to sign up: ', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <Button type="submit">Sign Up</Button>
        </form>
    );
};

export default SignUp;
