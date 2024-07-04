import React from 'react';
import ImageEditor from 'features/imageEditor/ui/ImageEditor';
import ToolBar from 'features/imageEditor/ui/ToolBar';

const ImageEditorPage = () => (
    <div>
        <h1>Image Editor</h1>
        <ToolBar />
        <ImageEditor />
    </div>
);

export default ImageEditorPage;
