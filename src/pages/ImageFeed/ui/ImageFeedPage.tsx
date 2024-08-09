import React, { useState } from "react";
import { useAppSelector } from "shared/hooks/hooks";
import { useFetchImages, useDeleteImage } from "features/imageGallery/api/api";
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  Box,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import VirtualizedImageList from "entities/image/VirtualizedImageList";

const ImageFeedPage = () => {
  const [page, setPage] = useState(1);
  const userId = useAppSelector((state) => state.auth.userId);
  const {
    data: images = [],
    error,
    isLoading,
  } = useFetchImages(userId || undefined, page);
  const deleteImageMutation = useDeleteImage();
  const navigate = useNavigate();

  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

  const limitPerPage = 15;
  const hasNextPage = images.length === limitPerPage;

  const handleDelete = (id: string) => {
    deleteImageMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Image deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete image: ${error.message}`);
      },
    });
  };

  const handleEdit = (id: string) => {
    navigate(`/editor/${id}`);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6">
          Failed to load images: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <ToastContainer autoClose={3000} hideProgressBar />
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/editor")}
        sx={{ my: 2 }}
      >
        Create Image
      </Button>
      {images.length > 0 ? (
        <>
          <VirtualizedImageList
            images={images}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Previous Page
            </Button>
            <Button
              variant="contained"
              onClick={handleNextPage}
              disabled={!hasNextPage}
            >
              Next Page
            </Button>
          </Box>
        </>
      ) : (
        <Typography mt={2}>No images yet.</Typography>
      )}
    </Container>
  );
};

export default ImageFeedPage;
