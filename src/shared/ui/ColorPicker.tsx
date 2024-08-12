import React, { useCallback, useState, useEffect, useRef } from "react";
import { debounce, TextField } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const ColorPicker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialColor = searchParams.get("color") || "#000000";
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    const newColor = searchParams.get("color") || "#000000";

    setColor(newColor);
  }, [searchParams]);

  const updateQueryParamsRef = useRef(
    debounce((key: string, value: string, searchParams: URLSearchParams) => {
      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set(key, value);
      setSearchParams(newSearchParams);
    }, 300),
  ).current;

  const handleColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = event.target.value;

      setColor(newColor);
      updateQueryParamsRef("color", newColor, searchParams);
    },
    [updateQueryParamsRef, searchParams],
  );

  return (
    <TextField
      type="color"
      value={color}
      onChange={handleColorChange}
      label="Brush Color"
      variant="outlined"
      margin="normal"
      className="controls"
    />
  );
};

export default ColorPicker;
