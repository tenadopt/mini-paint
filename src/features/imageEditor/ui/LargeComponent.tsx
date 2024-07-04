import React from 'react';

const LargeComponent = () => {
    return (
        <div>
            <h1>This is a large component</h1>
            <p>This component is loaded dynamically to optimize the initial bundle size.</p>
        </div>
    );
};

export default LargeComponent;
