import React from 'react';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltOutlined from '@mui/icons-material/ListAltOutlined';
import Menu from '@mui/icons-material/Menu';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';

interface IconSelectorProps {
    type: string;
}

const IconSelector: React.FC<IconSelectorProps> = (props: IconSelectorProps) => {
    const Icons = {
        DashboardOutlined: <DashboardOutlined />,
        ListAltOutlined: <ListAltOutlined />,
        Menu: <Menu />,
        GroupOutlined: <GroupOutlined />,
        ManageAccountsIcon: <ManageAccountsIcon />,
        SettingsIcon: <SettingsIcon />,
        ExitToAppIcon: <ExitToAppIcon />,
        ExpandLess: <ExpandLess />,
        ExpandMore: <ExpandMore />
    };

    const getIcon = (type: string) => {
        // Default Icon when not found
        let comp = <QuestionMarkIcon />;

        let typeNew = type ? type : "";

        // Default is Outlined when no theme was appended (ex: 'smile')
        if (!typeNew.match(/.+(Outlined|Filled|TwoTone)$/i)) {
            typeNew += 'Outlined';
        }

        // If found by key then return value which is component
        const found = Object.entries(Icons).find(([k]) => k.toLowerCase() === typeNew.toLowerCase());
        if (found) {
            [, comp] = found;
        }

        return comp;
    };

    return getIcon(props.type);
};

export default IconSelector;