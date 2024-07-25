import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWorkById, updateWork } from 'features/works/api/worksServices';
import { Work } from 'features/works/types';
import { Container, Typography, Box, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import renderLoading from "shared/model/renderLoading";
import RenderError from "shared/model/RenderError";

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
                    toast.error('Work not found');
                }
            } catch (err) {
                setError('Failed to load work');
                toast.error('Failed to load work');
            } finally {
                setLoading(false);
            }
        };
        loadWork().catch(err => {
            console.error('Unexpected error:', err);
            toast.error('An unexpected error occurred');
        });
    }, [workId]);

    const handleUpdate = async () => {
        if (!work || !workId) return;
        const updatedData = { title: 'New Title' };
        try {
            await updateWork(workId, updatedData);
            setWork({ ...work, ...updatedData });
            toast.success('Work updated successfully');
        } catch (error) {
            console.error('Error updating work:', error);
            toast.error('Failed to update work');
        }
    };

    if (loading) {
        return renderLoading();
    }

    if (error) {
        return <RenderError error={error} />
    }

    if (work) return (
        <Container maxWidth="md">
            <ToastContainer />
            {work && (
                <Box>
                    <Typography variant="h4">{work.title}</Typography>
                    <Typography variant="body1">{work.description}</Typography>
                    <Button onClick={handleUpdate} color="primary">Update Work</Button>
                </Box>
            )}
        </Container>
    );
};

export default WorkPage;