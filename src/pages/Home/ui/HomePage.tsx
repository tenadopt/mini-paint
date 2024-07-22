import React, { useEffect, useState } from 'react';
import { Container, Box, Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchUserWorks, deleteWork } from 'features/works/api/worksServices';
import { useAppSelector } from 'shared/hooks/hooks';
import { Work } from 'features/works/types';

const HomePage = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const userId = useAppSelector((state) => state.auth.userId);
    const navigate = useNavigate();

    useEffect(() => {
        const loadWorks = async () => {
            setLoading(true);
            setError(null);
            try {
                if (userId) {
                    const userWorks = await fetchUserWorks(userId);
                    setWorks(userWorks);
                }
            } catch (err) {
                setError('Failed to load works');
            } finally {
                setLoading(false);
            }
        };
        loadWorks();
    }, [userId]);

    const handleDelete = async (workId: string) => {
        try {
            await deleteWork(workId);
            setWorks(works.filter(work => work.id !== workId));
        } catch (err) {
            setError('Failed to delete work');
        }
    };

    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="contained" color="primary" onClick={() => navigate('/editor')}>
                    Create New Work
                </Button>
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : works.length === 0 ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Typography>No works found.</Typography>
                </Box>
            ) : (
                <Grid container spacing={2} mt={2}>
                    {works.map(work => (
                        <Grid item xs={12} sm={6} md={4} key={work.id}>
                            <Card onClick={() => navigate(`/editor/${work.id}`)}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={work.imageUrl}
                                    alt={work.title}
                                />
                                <CardContent>
                                    <Typography variant="h6">{work.title}</Typography>
                                    <Typography variant="body2">{work.description}</Typography>
                                    <Button onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(work.id);
                                    }} color="secondary">
                                        Delete
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default HomePage;