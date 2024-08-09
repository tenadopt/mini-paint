import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Image } from "features/imageGallery/api/api";

interface ImageGridProps {
  images: Image[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ImageGrid = ({ images, onEdit, onDelete }: ImageGridProps) => (
  <Grid container spacing={2}>
    {images.map((image) => (
      <Grid item xs={12} sm={6} md={4} key={image.id}>
        <Card onClick={() => onEdit(image.id)} style={{ cursor: "pointer" }}>
          {image.imageUrl ? (
            <CardMedia
              component="img"
              height="200"
              image={image.imageUrl}
              alt={image.title}
              sx={{ maxHeight: "200px", objectFit: "cover" }}
            />
          ) : (
            <CardContent>
              <Typography variant="h6">Image not available</Typography>
            </CardContent>
          )}
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6">{image.title}</Typography>
              <Typography variant="body2">{image.description}</Typography>
            </Box>
            <IconButton
              aria-label="delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default ImageGrid;
