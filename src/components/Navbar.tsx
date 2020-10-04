import { AppBar, Button, createStyles, ListItemIcon, ListItemText, makeStyles, Menu, MenuItem, Theme, Toolbar, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import CloudIcon from '@material-ui/icons/Cloud';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LanguageIcon from '@material-ui/icons/Language';

const useStyles = makeStyles((theme: Theme) => createStyles({
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
    cloudIcon: {
        marginLeft: theme.spacing(1)
    },
    languageFlag: {
        width: 50,
    }
}))

const Navbar = () => {
    const classes = useStyles();
    const [languageButtonEl, setLanguageButtonEl] = useState<null | HTMLElement>(null);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="h1" className={classes.title}>
                    Tlaloc <CloudIcon className={classes.cloudIcon} />
                </Typography>
                <Button color="inherit">
                    <NotificationsIcon />
                </Button>
                <Button color="inherit" className={classes.languageFlag} onClick={e => setLanguageButtonEl(e.currentTarget)}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_the_United_Kingdom.svg" alt="United Kingdom Flag" />
                </Button>
                <Menu
                anchorEl={languageButtonEl}
                keepMounted
                open={Boolean(languageButtonEl)}
                onClose={() => setLanguageButtonEl(null)}
                >
                    <MenuItem onClick={() => setLanguageButtonEl(null)}>
                        <ListItemIcon><LanguageIcon fontSize="small" /></ListItemIcon>
                        <ListItemText primary="English" />
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;