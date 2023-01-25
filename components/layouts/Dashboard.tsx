import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';

import List from '@mui/material/List';
import Link from '../Link';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltOutlined from '@mui/icons-material/ListAltOutlined';
import Menu from '@mui/icons-material/Menu';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CustomIcon from "../CustomIcon";
import ListSubheader from '@mui/material/ListSubheader';


const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

function DashboardContent({ children }: any) {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [openList, setOpenList] = React.useState(false);
    const [menu, setMenu] = useState([]);

    const handleClickList = () => {
        setOpenList(!openList);
    };

    const Router = useRouter()

    useEffect(() => {
        const getMenu = async () => {
            const response = await fetch(`/api/menu`);
            if (response.status === 200) {
                const resData = await response.json();
                setMenu(resData.data)
            }

            if (response.status !== 200) {
                return alert("Something Went Wrong");
            }
        }

        getMenu()
    }, [])

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open} className="header-custom" style={{ background: "transparent" }}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                            justifyContent: "flex-end"
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <Menu />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} className="drawer-custom">
                    <Toolbar>
                        Trial Dashboard - Nisrina
                    </Toolbar>
                    {/* <Divider /> */}
                    <List component="nav" className="nav-custom">
                        {
                            menu.length > 0 ?
                                menu.map((item: any, index: number) => (
                                    item.children! ?
                                        <React.Fragment key={item.menu + index}>
                                            <ListItemButton onClick={handleClickList}>
                                                <ListItemIcon>
                                                    <CustomIcon type={"SettingsIcon"} />
                                                </ListItemIcon>
                                                <ListItemText primary={item.menu} />
                                                {openList ? <ExpandLess /> : <ExpandMore />}
                                            </ListItemButton>
                                            <Collapse in={openList} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    {item.children.map((child: any, idx: number) =>
                                                        <Link key={child.key} href={child.path}>
                                                            <ListItemButton className={Router.pathname === child.path ? 'active' : ''}>
                                                                <ListItemText primary={child.menu} />
                                                            </ListItemButton>
                                                        </Link>
                                                    )}
                                                </List>
                                            </Collapse>
                                        </React.Fragment>
                                        :
                                        <Link key={item.key} href={item.path} >
                                            <ListItemButton className={Router.pathname === item.path ? 'active' : ''}>
                                                <ListItemIcon>
                                                    <CustomIcon type={item.icon} />
                                                </ListItemIcon>
                                                <ListItemText primary={item.menu} />
                                            </ListItemButton>
                                        </Link>
                                )) :
                                <>
                                    {/* <Link href=""> */}
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <CircularProgress color="inherit" size={20} />
                                            </ListItemIcon>
                                            <ListItemText primary="Loading .." />
                                        </ListItemButton>
                                    {/* </Link> */}

                                </>
                        }
                    </List>
                </Drawer>
                <Box
                    className='main-content'
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    {children}
                </Box>
            </Box>
        </ThemeProvider >
    );
}

export default React.memo(DashboardContent)
