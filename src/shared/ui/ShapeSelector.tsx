import React, { useCallback } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

const ShapeSelector = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shape = searchParams.get("shape") || "line";

  const handleShapeChange = useCallback(
    (event: SelectChangeEvent) => {
      const newShape = event.target.value;
      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set("shape", newShape);
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams],
  );

  return (
    <FormControl variant="outlined" className="center-box">
      <InputLabel>Shape</InputLabel>
      <Select value={shape} onChange={handleShapeChange} label="Shape">
        <MenuItem value="line">Line</MenuItem>
        <MenuItem value="star">Star</MenuItem>
        <MenuItem value="polygon">Polygon</MenuItem>
        <MenuItem value="circle">Circle</MenuItem>
        <MenuItem value="rectangle">Rectangle</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ShapeSelector;
