import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const mainListItems = (
    <React.Fragment>
        <ListItemButton className='active'>
            <ListItemIcon>
                <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Entries Summary" />
        </ListItemButton>
        <ListItemButton selected>
            <ListItemIcon>
                <ListAltOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Survey Entries" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <GroupOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Registered Users" />
        </ListItemButton>
    </React.Fragment>
);

export const secondaryListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            Saved reports
        </ListSubheader>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Current month" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Last quarter" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Year-end sale" />
        </ListItemButton>
    </React.Fragment>
);
