import { configureStore } from '@reduxjs/toolkit';
import imageEditorReducer from 'features/imageEditor/model/imageEditorSlice';
import authReducer from 'features/auth/model/authSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        imageEditor: imageEditorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;