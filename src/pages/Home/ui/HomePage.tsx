import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "app/store";
import {fetchUserWorks} from "features/works/api/fetchUserWorks";
import {Box, Card, CardContent, CircularProgress, Container, Grid, Typography} from "@mui/material";
import {Work} from 'features/works/types'

const HomePage = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const userId = useSelector((state: RootState) => state.auth.userId);

    useEffect(() => {
        const loadWorks = async () => {
            try {
                setLoading(true);
                if (userId) {
                    const userWorks = await fetchUserWorks(userId);
                    setWorks(userWorks);
                } else {
                    setError("User not logged in")
                }

            } catch (err) {
                setError('Failed to load works')
            } finally {
                setLoading(false);
            }
        };

        loadWorks();
    }, [userId]);

    if (loading) {
        return (
            <Container maxWidth='md'>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress/>
                </Box>
            </Container>
        )
    }

    if (error) {
        return (
            <Container maxWidth='md'>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                </Box>
            </Container>
        )
    }

    if (works.length === 0) {
        return (
            <Container maxWidth="md">
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Typography variant="h6">You have no works here</Typography>
                </Box>
            </Container>
        )
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Your Works
            </Typography>
            <Grid container spacing={2}>
                {works.map((work) => (
                    <Grid item xs={12} sm={6} md={4} key={work.id}>
                        <Card>
                            <img src={work.imageUrl} alt={work.title}
                                 style={{width: '100%', height: '200px', objectFit: 'cover'}}/>
                            <CardContent>
                                <Typography variant="h6">{work.title}</Typography>
                                <Typography variant="body2">{work.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HomePage;