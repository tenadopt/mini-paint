import React, { useEffect, useState, useRef } from "react";
import { debounce, Slider } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const BrushSizeSlider = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBrushSize = parseInt(searchParams.get("brushSize") || "5", 10);
  const [localBrushSize, setLocalBrushSize] =
    useState<number>(initialBrushSize);

  useEffect(() => {
    const newBrushSize = parseInt(searchParams.get("brushSize") || "5", 10);

    setLocalBrushSize(newBrushSize);
  }, [searchParams]);

  const updateQueryParamRef = useRef(
    debounce((newBrushSize: number, searchParams: URLSearchParams) => {
      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set("brushSize", newBrushSize.toString());
      setSearchParams(newSearchParams);
    }, 300),
  ).current;

  const handleBrushSizeChange = (_: unknown, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setLocalBrushSize(newValue);
      updateQueryParamRef(newValue, searchParams);
    }
  };

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

export default BrushSizeSlider;
