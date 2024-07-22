import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWorkById, updateWork } from 'features/works/api/worksServices';
import { Work } from 'features/works/types';
import { Container, CircularProgress, Typography, Box, Button } from '@mui/material';

const WorkPage = () => {
    const { workId } = useParams<{ workId: string }>();
    const [work, setWork] = useState<Work | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWork = async () => {
            if (!workId) return;
            setLoading(true);
            setError(null);
            try {
                const fetchedWork = await fetchWorkById(workId);
                if (fetchedWork) {
                    setWork(fetchedWork);
                } else {
                    setError('Work not found');
                }
            } catch (err) {
                setError('Failed to load work');
            } finally {
                setLoading(false);
            }
        };
        loadWork();
    }, [workId]);

    const handleUpdate = async () => {
        if (!work || !workId) return;
        const updatedData = { title: 'New Title' }; // Example of updated data
        try {
            await updateWork(workId, updatedData);
            setWork({ ...work, ...updatedData });
            alert('Work updated successfully');
        } catch (error) {
            console.error('Error updating work:', error);
            alert('Failed to update work');
        }
    };

    return (
        <Container maxWidth="md">
            {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : work ? (
                <Box>
                    <Typography variant="h4">{work.title}</Typography>
                    <Typography variant="body1">{work.description}</Typography>
                    <Button onClick={handleUpdate} color="primary">Update Work</Button>
                </Box>
            ) : null}
        </Container>
    );
};

export default WorkPage;
