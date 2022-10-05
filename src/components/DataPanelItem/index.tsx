import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { RenderIf } from 'components/RenderIf/RenderIf';
interface Props {
    icon?: any
    handleClick: () => void
    open: boolean
    text: string
}
export const DataPanelItem = (props: Props) => {
    const {
        icon,
        handleClick,
        open,
        text
    } = props
    return (
        <>
            <ListItemButton role={undefined} onClick={handleClick} sx={{ backgroundColor: '#f3f6f4' }} dense>
                <RenderIf isTrue={icon}>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                </RenderIf>
                <ListItemText primary={text} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
        </>
    )
}
