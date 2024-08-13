import React from "react";
import { Grid } from "@mui/material";
import { Image } from "features/imageGallery/api/api";
import WorkCard from "./WorkCard";

interface ImageGridProps {
  images: Image[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const VirtualizedWorkGrid = ({ images, onEdit, onDelete }: ImageGridProps) => (
  <Grid container spacing={2}>
    {images.map((image) => (
      <Grid item xs={12} sm={6} md={4} key={image.id}>
        <WorkCard image={image} onEdit={onEdit} onDelete={onDelete} />
      </Grid>
    ))}
  </Grid>
);

export default VirtualizedWorkGrid;
