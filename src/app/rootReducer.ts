import { combineReducers } from '@reduxjs/toolkit';
import imageEditorReducer from 'features/imageEditor/model/imageEditorSlice';
import authReducer from 'features/auth/model/authSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    imageEditor: imageEditorReducer,
});

export default rootReducer;
