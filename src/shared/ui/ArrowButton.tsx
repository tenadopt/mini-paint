import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
    minWidth: 'auto',
    padding: '6px',
    backgroundColor: 'transparent',
    color: '#007aff',
    border: 'none',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: 'transparent',
        color: '#00c4ff',
    },
    '&:disabled': {
        color: '#424242',
    },
});


interface ArrowButtonProps {
    direction: 'left' | 'right';
    onClick: () => void;
    disabled?: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ direction, onClick, disabled }) => {
    return (
        <StyledButton onClick={onClick} disabled={disabled}>
            <span style={{ fontSize: '1.5rem' }}>
                {direction === 'left' ? '<' : '>'}
            </span>
        </StyledButton>
    );
};

export default ArrowButton;