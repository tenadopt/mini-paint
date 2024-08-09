import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    color: "#000000",
  },
};

const imageEditorSlice = createSlice({
  name: "imageEditor",
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

export const { setBrushSize, setColor } = imageEditorSlice.actions;
export default imageEditorSlice.reducer;
