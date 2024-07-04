import { combineReducers } from '@reduxjs/toolkit';
import imageEditorReducer from 'features/imageEditor/model/imageEditorSlice';

const rootReducer = combineReducers({
    imageEditor: imageEditorReducer,
});

export default rootReducer;
