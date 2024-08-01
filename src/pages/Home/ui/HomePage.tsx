import React, { useEffect, useState } from 'react';
import {toast, ToastContainer} from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'shared/hooks/hooks';
import { fetchUserWorks, deleteWork } from 'features/works/api/worksServices';
import { Work } from 'features/works/types';
import {
    Container,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button
} from '@mui/material';
import DeleteDialog from "shared/model/DeleteDialog";
import renderLoading from "shared/model/renderLoading";
import RenderError from "shared/model/RenderError";

const HomePage = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const userId = useAppSelector(state => state.auth.userId);
    const navigate = useNavigate();

    useEffect(() => {
        const loadWorks = async () => {
            setLoading(true);
            setError(null);
            try {
                if (userId) {
                    const userWorks = await fetchUserWorks(userId);
                    setWorks(userWorks);
                    toast.success('Works loaded successfully');
                }
            } catch (err) {
                setError('Failed to load works');
                toast.error('Failed to load works');
            } finally {
                setLoading(false);
            }
        };

        loadWorks().catch(err => {
            console.error(err);
            toast.error('An unexpected error occurred');
        });
    }, [userId]);

    const handleDelete = async () => {
        if (!selectedWorkId) return;
        try {
            await deleteWork(selectedWorkId);
            setWorks(works.filter(work => work.id !== selectedWorkId));
            toast.success('Work deleted successfully');
            setOpenDialog(false);
        } catch (err) {
            setError('Failed to delete work');
            toast.error('Failed to delete work');
            setOpenDialog(false);
        }
    };

    const handleOpenDialog = (workId: string) => {
        setSelectedWorkId(workId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedWorkId(null);
    };

    return (
        <Container maxWidth="md">
            <ToastContainer />
            <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="contained" color="primary" onClick={() => navigate('/editor')}>
                    Create New Work
                </Button>
            </Box>
            {loading && renderLoading()}
            {!loading && error && <RenderError error={error}/>}
            {!loading && !error && works.length === 0 && (
                <Typography mt={2}>No works found.</Typography>
            )}
            {!loading && !error && works.length > 0 && (
                <Grid container spacing={2} mt={2}>
                    {works.map(work => (
                        <Grid item xs={12} sm={6} md={4} key={work.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={work.imageUrl}
                                    alt={work.title}
                                    onClick={() => navigate(`/editor/${work.id}`)}
                                />
                                <CardContent>
                                    <Typography variant="h6">{work.title}</Typography>
                                    <Typography variant="body2">{work.description}</Typography>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDialog(work.id);
                                        }}
                                        color="secondary"
                                    >
                                        Delete
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            <DeleteDialog open={openDialog} onClose={handleCloseDialog} onDelete={handleDelete} />
        </Container>
    );
};


export default HomePage;