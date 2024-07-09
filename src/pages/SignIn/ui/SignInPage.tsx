import React from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit: SubmitHandler<SignInFormValues> = (data) => {
        console.log(data);
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                >
                    Sign In
                </Button>
            </Box>
        </Container>
    );
};

export default SignInPage;