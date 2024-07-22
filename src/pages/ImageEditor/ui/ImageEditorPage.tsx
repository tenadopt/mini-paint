import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, getDoc, addDoc, updateDoc, collection, DocumentReference, CollectionReference } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { useAppSelector } from 'shared/hooks/hooks';
import { selectAuth } from 'features/auth/model/authSlice';
import CanvasEditor from 'features/imageEditor/ui/CanvasEditor';
import firebase from "firebase/compat";
import UpdateData = firebase.firestore.UpdateData;

const workSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().url('Invalid URL'),
});

type WorkFormValues = z.infer<typeof workSchema>;

interface Work extends WorkFormValues {
    userId: string;
}

const ImageEditorPage: React.FC = () => {
    const { workId } = useParams<{ workId: string }>();
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
            if (workId) {
                setLoading(true);
                try {
                    const docRef: DocumentReference<Work> = doc(db, 'works', workId) as DocumentReference<Work>;
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const work = docSnap.data() as Work;
                        if (work.userId === userId) {
                            const { title, description, imageUrl } = work;
                            setInitialData({ title, description, imageUrl });
                            setValue<'title'>('title', title);
                            setValue<'description'>('description', description);
                            setValue<'imageUrl'>('imageUrl', imageUrl);
                            setIsEditing(true);
                        } else {
                            setError('Work not found or you do not have access');
                        }
                    } else {
                        setError('Work not found');
                    }
                } catch (err) {
                    setError('Failed to load work');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadWork().catch(console.error);
    }, [workId, userId, setValue]);

    const onSubmit: SubmitHandler<WorkFormValues> = async (data) => {
        if (!userId) return;
        setLoading(true);
        try {
            if (isEditing && workId) {
                const docRef: DocumentReference<Work> = doc(db, 'works', workId) as DocumentReference<Work>;
                await updateDoc(docRef, data as UpdateData<Work>);
                alert('Work updated successfully');
            } else {
                const worksCollection: CollectionReference<Work> = collection(db, 'works') as CollectionReference<Work>;
                await addDoc(worksCollection, { ...data, userId });
                alert('Work added successfully');
            }
            navigate('/');
        } catch (err) {
            setError('Failed to save work');
        } finally {
            setLoading(false);
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