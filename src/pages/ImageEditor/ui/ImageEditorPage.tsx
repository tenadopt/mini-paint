import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addWork, fetchWorkById, updateWork } from 'features/works/api/worksServices';
import { useAppSelector } from 'shared/hooks/hooks';
import { selectAuth } from 'features/auth/model/authSlice';
import CanvasEditor from 'features/imageEditor/ui/CanvasEditor';

const workSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().url('Invalid URL'),
});

type WorkFormValues = z.infer<typeof workSchema>;

const ImageEditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { userId } = useAppSelector(selectAuth);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<WorkFormValues>({
        resolver: zodResolver(workSchema),
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<WorkFormValues | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const loadWork = async () => {
            if (id) {
                setLoading(true); // Set loading to true when fetching data
                try {
                    const work = await fetchWorkById(id);
                    if (work && work.userId === userId) {
                        setInitialData(work);
                        setValue('title', work.title);
                        setValue('description', work.description);
                        setValue('imageUrl', work.imageUrl);
                        setIsEditing(true);
                    } else {
                        setError('Work not found or you do not have access');
                    }
                } catch (err) {
                    setError('Failed to load work');
                } finally {
                    setLoading(false); // Ensure loading is set to false after fetching
                }
            } else {
                setLoading(false);
            }
        };
        loadWork();
    }, [id, userId, setValue]);

    const onSubmit: SubmitHandler<WorkFormValues> = async (data) => {
        if (!userId) return;
        setLoading(true); // Set loading to true when saving data
        try {
            if (isEditing && id) {
                await updateWork(id, data);
                alert('Work updated successfully');
            } else {
                await addWork({ ...data, userId });
                alert('Work added successfully');
            }
            navigate('/');
        } catch (err) {
            setError('Failed to save work');
        } finally {
            setLoading(false); // Ensure loading is set to false after saving
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
            ) : (
                <>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {isEditing ? 'Edit Work' : 'Create New Work'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            label="Title"
                            fullWidth
                            margin="normal"
                            {...register('title')}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            margin="normal"
                            {...register('description')}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                        <TextField
                            label="Image URL"
                            fullWidth
                            margin="normal"
                            {...register('imageUrl')}
                            error={!!errors.imageUrl}
                            helperText={errors.imageUrl?.message}
                        />
                        <CanvasEditor imageUrl={initialData?.imageUrl || ''} />
                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : isEditing ? 'Update Work' : 'Create Work'}
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default ImageEditorPage;