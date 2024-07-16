import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Grid, Card, CardMedia, CardContent, Typography, CircularProgress } from '@mui/material';
import { fetchImages } from 'features/imageGallery/api/imageService';
import {Image} from "features/imageGallery/api/imageService";

const ImageFeed = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filterUserId, setFilterUserId] = useState<string>("");

    useEffect(() => {
        const loadImages = async () => {
            setLoading(true);
            setError(null);
            try {
                const images = await fetchImages(filterUserId);
                setImages(images);
            } catch (err) {
                setError('Failed to load images');
            } finally {
                setLoading(false);
            }
        };
        loadImages();
    }, [filterUserId]);

    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="center" mt={2}>
                <TextField
                    label="Filter by User ID"
                    variant="outlined"
                    value={filterUserId}
                    onChange={(e) => setFilterUserId(e.target.value)}
                    fullWidth
                />
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : (
                <Grid container spacing={2} mt={2}>
                    {images.map(image => (
                        <Grid item xs={12} sm={6} md={4} key={image.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={image.imageUrl}
                                    alt={`Image by ${image.userId}`}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary">
                                        Uploaded by: {image.userId}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {new Date(image.createdAt).toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default ImageFeed;