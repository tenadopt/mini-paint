import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

interface ButtonLinkProps extends Omit<RouterLinkProps, 'to'> {
    to: string;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>((props, ref) => {
    const { to, ...other } = props;
    return <RouterLink ref={ref} to={to} {...other} />;
});

ButtonLink.displayName = 'ButtonLink'; // Указываем displayName для отладки

const Header = () => (
    <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
                Mini Paint
            </Typography>
            <Button color="inherit" component={ButtonLink} to="/signin">
                Sign In
            </Button>
            <Button color="inherit" component={ButtonLink} to="/signup">
                Sign Up
            </Button>
        </Toolbar>
    </AppBar>
);

export default Header;