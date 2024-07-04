import { configureStore } from '@reduxjs/toolkit';
import imageEditorReducer from 'features/imageEditor/model/imageEditorSlice';

const store = configureStore({
    reducer: {
        imageEditor: imageEditorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
