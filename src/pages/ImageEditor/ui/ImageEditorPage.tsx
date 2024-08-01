import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography } from '@mui/material';
import { useForm, SubmitHandler, FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, getDoc, addDoc, updateDoc, collection, DocumentReference, CollectionReference, UpdateData } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { useAppSelector } from 'shared/hooks/hooks';
import { selectAuth } from 'features/auth/model/authSlice';
import CanvasEditor from 'features/imageEditor/ui/CanvasEditor';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import renderLoading from 'shared/model/renderLoading';
import RenderError from 'shared/model/RenderError';

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
            if (!workId) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const docRef = doc(db, 'works', workId) as DocumentReference<Work>;
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    toast.error('Work not found');
                    setLoading(false);
                    return;
                }

                const work = docSnap.data() as Work;

                if (work.userId !== userId) {
                    toast.error('Work not found or you do not have access');
                    setLoading(false);
                    return;
                }

                const { title, description, imageUrl } = work;
                setInitialData({ title, description, imageUrl });
                setValue<'title'>('title', title);
                setValue<'description'>('description', description);
                setValue<'imageUrl'>('imageUrl', imageUrl);
                setIsEditing(true);

            } catch (err) {
                toast.error('Failed to load work');
                setError('Failed to load work');
            } finally {
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
                await updateDoc(docRef, data as UpdateData<WorkFormValues>);
                toast.success('Work updated successfully');
            } else {
                const worksCollection: CollectionReference<Work> = collection(db, 'works') as CollectionReference<Work>;
                await addDoc(worksCollection, { ...data, userId });
                toast.success('Work added successfully');
            }
            navigate('/');
        } catch (err) {
            setError('Failed to save work');
            toast.error('Failed to save work');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                {renderLoading()}
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <RenderError error={error} />
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                {isEditing ? 'Edit Work' : 'Create New Work'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    {...register('title' as FieldPath<WorkFormValues>)}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />
                <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    {...register('description' as FieldPath<WorkFormValues>)}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                />
                <TextField
                    label="Image URL"
                    fullWidth
                    margin="normal"
                    {...register('imageUrl' as FieldPath<WorkFormValues>)}
                    error={!!errors.imageUrl}
                    helperText={errors.imageUrl?.message}
                />
                <CanvasEditor imageUrl={initialData?.imageUrl || ''} />
                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                    {loading ? renderLoading() : isEditing ? 'Update Work' : 'Create Work'}
                </Button>
            </Box>
        </Container>
    );
};

export default ImageEditorPage;