import React, {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useAppSelector} from 'shared/hooks/hooks';
import {useFetchImages, useDeleteImage} from 'features/imageGallery/api/api';
import {Button, CircularProgress, Container, Typography, Box} from '@mui/material';
import {ToastContainer, toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import VirtualizedWorkGrid from 'entities/image/ui/VirtualizedWorkGrid';
import {fetchTotalImagesCount} from 'features/imageGallery/api/api';
import ArrowButton from "shared/ui/ArrowButton";

const ImageFeedPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalImages, setTotalImages] = useState(0);
    const [isNewImageAdded, setIsNewImageAdded] = useState(false);

    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const userId = useAppSelector(state => state.auth.userId) || undefined;
    const {data: images = [], error, isLoading} = useFetchImages(userId, page);
    const deleteImageMutation = useDeleteImage();
    const navigate = useNavigate();

    const limitPerPage = 15;
    const totalPages = Math.ceil(totalImages / limitPerPage);
    const hasNextPage = page < totalPages;

    useEffect(() => {
        const fetchTotalImages = async () => {
            try {
                const count = await fetchTotalImagesCount(userId);

                setTotalImages(count);

                if (isNewImageAdded) {
                    const newTotalPages = Math.ceil(count / limitPerPage);

                    if (page !== newTotalPages) {
                        setSearchParams({page: newTotalPages.toString()});
                    }

                    setIsNewImageAdded(false);
                }
            } catch (error) {
                toast.error('Failed to fetch total images. Please try again later.');
            }
        };

        fetchTotalImages();
    }, [userId, isNewImageAdded, page, setSearchParams, totalPages]);

    const handleDelete = (id: string) => {
        deleteImageMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Image deleted successfully');

                setTotalImages(prevTotal => prevTotal - 1);

                if (images.length === 1 && page > 1) {
                    setSearchParams({page: (page - 1).toString()});
                }
            },
            onError: (error) => {
                toast.error(`Failed to delete image: ${error.message}`);
            },
        });
    };

    const handleEdit = (id: string) => {
        navigate(`/editor/${id}`);
    };

    const handleCreateImage = () => {
        navigate('/editor');
        setIsNewImageAdded(true);
    };

    const renderPagination = () => {
        if (totalPages <= 7) {
            return Array.from({length: totalPages}, (_, i) => (
                <Button
                    key={i + 1}
                    onClick={() => setSearchParams({page: (i + 1).toString()})}
                    disabled={page === i + 1}
                >
                    {i + 1}
                </Button>
            ));
        }

        return (
            <>
                <Button onClick={() => setSearchParams({page: '1'})} disabled={page === 1}>1</Button>
                {page > 4 && <span>...</span>}
                {Array.from({length: Math.min(3, totalPages - 2)}, (_, i) => {
                    const pageNumber = Math.max(2, page - 1) + i;

                    return (
                        <Button
                            key={pageNumber}
                            onClick={() => setSearchParams({page: pageNumber.toString()})}
                            disabled={page === pageNumber}
                        >
                            {pageNumber}
                        </Button>
                    );
                })}
                {page < totalPages - 3 && <span>...</span>}
                <Button onClick={() => setSearchParams({page: totalPages.toString()})} disabled={page === totalPages}>
                    {totalPages}
                </Button>
            </>
        );
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
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

    return (
        <Container maxWidth="md">
            <ToastContainer autoClose={3000} hideProgressBar/>
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateImage}
                sx={{my: 2}}
            >
                Create Image
            </Button>
            {images.length > 0 ? (
                <>
                    <VirtualizedWorkGrid images={images} onEdit={handleEdit} onDelete={handleDelete}/>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <ArrowButton
                            direction="left"
                            onClick={() => setSearchParams({page: (page - 1).toString()})}
                            disabled={page === 1}
                        />
                        {renderPagination()}
                        <ArrowButton
                            direction="right"
                            onClick={() => setSearchParams({page: (page + 1).toString()})}
                            disabled={!hasNextPage}
                        />
                    </Box>
                </>
            ) : (
                <Typography mt={2}>No images yet.</Typography>
            )}
        </Container>
    );
}

export default ImageFeedPage;
