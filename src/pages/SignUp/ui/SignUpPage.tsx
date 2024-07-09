import {z} from 'zod'
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Container, TextField, Typography} from "@mui/material";
import React from "react";


const signUpSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
    confirmPassword: z.string().min(8, {message: "Password must be at least 8 characters"}),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema)
    })

    const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
        console.log(data);
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Sign Up
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
                <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    margin="normal"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                >
                    Sign Up
                </Button>
            </Box>
        </Container>
    );
};

export default SignUpPage;