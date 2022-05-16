import { ListItem, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Collapse, } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { RenderIf } from 'components/RenderIf/RenderIf';
interface Props {
    icon?: any
    item: string
    handleClick: any
    open: any
}
export const DataPanelItem = (props: Props) => {
    const {
        icon,
        handleClick,
        item,
        open
    } = props
    return (
        <>
            <ListItemButton role={undefined} onClick={handleClick(item)} dense>
                <RenderIf isTrue={icon}>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                </RenderIf>
                <ListItemText primary={item} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
        </>
    )
}
