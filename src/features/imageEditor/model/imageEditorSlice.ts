import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

interface ImageEditorSettings {
    brushSize: number;
    color: string;
}

interface ImageEditorState {
    settings: ImageEditorSettings;
}

interface SetBrushSizePayload {
    brushSize: number;
}

interface SetColorPayload {
    color: string;
}

const initialState: ImageEditorState = {
    settings: {
        brushSize: 5,
        color: '#000000',
    },
};

const imageEditorSlice = createSlice({
    name: 'imageEditor',
    initialState,
    reducers: {
        setBrushSize(state, action: PayloadAction<SetBrushSizePayload>) {
            state.settings.brushSize = action.payload.brushSize;
        },
        setColor(state, action: PayloadAction<SetColorPayload>) {
            state.settings.color = action.payload.color;
        },
    },
});

// Custom action creators to handle multiple arguments
export const setBrushSizeWithState = createAction<SetBrushSizePayload>('imageEditor/setBrushSizeWithState');
export const setColorWithState = createAction<SetColorPayload>('imageEditor/setColorWithState');

export const { setBrushSize, setColor } = imageEditorSlice.actions;
export default imageEditorSlice.reducer;