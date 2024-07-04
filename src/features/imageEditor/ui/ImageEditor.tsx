import React, { useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "app/store";
import { Button, Slider, TextField } from "@mui/material";
import { setBrushSizeWithState, setColorWithState } from "features/imageEditor/model/imageEditorSlice";

// Example of dynamic import (lazy loading)
const LargeComponent = lazy(() => import('./LargeComponent'));

const ImageEditor = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state: RootState) => state.imageEditor.settings);
    const [brushSize, setBrushSizeState] = useState<number>(settings.brushSize);
    const [color, setColorState] = useState<string>(settings.color);

    const handleBrushSizeChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setBrushSizeState(newValue);
            dispatch(setBrushSizeWithState({ brushSize: newValue }));
        }
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColorState(event.target.value);
        dispatch(setColorWithState({ color: event.target.value }));
    };

    return (
        <div>
            <Slider
                value={brushSize}
                onChange={handleBrushSizeChange}
                min={1}
                max={20}
                step={1}
            />
            <TextField
                type="color"
                value={color}
                onChange={handleColorChange}
            />
            <Button onClick={() => console.log('Draw!')}>Draw</Button>
            <Suspense fallback={<div>Loading...</div>}>
                <LargeComponent />
            </Suspense>
        </div>
    );
};

export default ImageEditor;