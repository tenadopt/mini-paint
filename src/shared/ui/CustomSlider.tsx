import React, {useCallback, useEffect, useState} from 'react';
import {debounce, Slider} from "@mui/material";
import {useSearchParams} from "react-router-dom";

const CustomSlider = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const initialBrushSize = parseInt(searchParams.get("brushSize") || "5", 10);
    const [localBrushSize, setLocalBrushSize] = useState<number>(initialBrushSize);

    const updateQueryParam = useCallback(
        debounce((newBrushSize: number) => {
            setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                brushSize: newBrushSize.toString(),
            });
        }, 300),
        [searchParams, setSearchParams]
    );

    const handleBrushSizeChange = (_: unknown, newValue: number | number[]) => {
        if (typeof newValue === "number") {
            setLocalBrushSize(newValue);
            updateQueryParam(newValue);
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