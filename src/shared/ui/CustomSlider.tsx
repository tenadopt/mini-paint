import React, { useEffect, useState, useRef } from "react";
import { debounce, Slider } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const CustomSlider = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBrushSize = parseInt(searchParams.get("brushSize") || "5", 10);
  const [localBrushSize, setLocalBrushSize] = useState<number>(initialBrushSize);

  const updateQueryParamRef = useRef(debounce((newBrushSize: number) => {
    setSearchParams(prevParams => ({
      ...Object.fromEntries(prevParams.entries()),
      brushSize: newBrushSize.toString(),
    }));
  }, 300)).current;

  const handleBrushSizeChange = (_: unknown, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setLocalBrushSize(newValue);
      updateQueryParamRef(newValue);
    }
  };

  useEffect(() => {
    setLocalBrushSize(initialBrushSize);
  }, [initialBrushSize]);

  return (
      <Slider
          value={localBrushSize}
          onChange={handleBrushSizeChange}
          min={1}
          max={50}
          valueLabelDisplay="auto"
          className="slider"
      />
  );
};

export default CustomSlider;