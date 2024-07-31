import React from 'react';
import { useAppSelector } from 'shared/hooks/hooks';
import { useFetchImages, useDeleteImage } from 'features/imageGallery/api/useImageQueries';
import {
    Button,
    CircularProgress,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Box
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const ImageFeedPage: React.FC = () => {
    const userId = useAppSelector(state => state.auth.userId);
    console.log('User ID:', userId);
    const { data: images = [], error, isLoading } = useFetchImages(userId || undefined);
    const deleteImageMutation = useDeleteImage();
    const navigate = useNavigate();

    const handleDelete = (id: string) => {
        deleteImageMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Image deleted successfully');
            },
            onError: (error) => {
                toast.error(`Failed to delete image: ${error.message}`);
            },
        });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6">Failed to load images: {error.message}</Typography>
            </Box>
        );
    }

    console.log('Fetched images:', images);

    return (
        <Container maxWidth="md">
            <ToastContainer />
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/editor')}
                sx={{ margin: 2 }}
            >
                Create Image
            </Button>
            {images.length > 0 ? (
                <Grid container spacing={2} mt={2}>
                    {images.map((image) => (
                        <Grid item xs={12} sm={6} md={4} key={image.id}>
                            <Card>
                                {image.imageUrl && (
                                    <CardMedia component="img" height="200" image={image.imageUrl} alt={image.title} />
                                )}
                                <CardContent>
                                    <Typography variant="h6">{image.title}</Typography>
                                    <Typography variant="body2">{image.description}</Typography>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDelete(image.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography mt={2}>No images yet.</Typography>
            )}
        </Container>
    );
};

export default ImageFeedPage;