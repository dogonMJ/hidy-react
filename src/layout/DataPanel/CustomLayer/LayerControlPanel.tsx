import { Stack, Box, Typography, IconButton, Button, Popover } from "@mui/material"
import LayersClearIcon from '@mui/icons-material/LayersClear';
import { useState } from "react";
import { OpacitySlider } from "components/OpacitySlider";
import { useAppDispatch } from "hooks/reduxHooks";

export const LayerControlPanel = (props: { layerList: any[], setLayerList: any }) => {
  const dispatch = useAppDispatch()
  const { layerList, setLayerList } = props
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const handlePopover = (event: React.MouseEvent<HTMLButtonElement>, layerName: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedLayer(layerName);
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedLayer(null);
  };
  return (
    <>
      {layerList.map((layer, index) => {
        const layerIndex = layerList.findIndex(item => item.name === layer.name);
        return (
          <Box key={layer.name} sx={{ border: 1, padding: 1, borderRadius: 1, borderColor: '#C0C0C0' }}>
            <Button
              size="small"
              sx={{ maxWidth: '100%', textTransform: 'none', justifyContent: 'flex-start' }}
              onClick={(event) => handlePopover(event, layer.name)}
            >
              <Typography sx={{ maxWidth: '100%', wordWrap: 'break-word', textAlign: 'left' }}>{layer.name}</Typography>
            </Button>
            <Popover
              open={selectedLayer === layer.name && Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{ vertical: 'top', horizontal: 'left', }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left', }}
              sx={{ maxWidth: '60%' }}
            >
              <Typography sx={{ p: 2, wordWrap: 'break-word' }}>{layer.url}</Typography>
            </Popover>
            <Stack direction={'row'}>
              <IconButton
                color={'error'}
                onClick={() => dispatch(setLayerList(layerList.filter((_, i) => i !== index)))}
              >
                <LayersClearIcon />
              </IconButton>
              <OpacitySlider
                opacity={layer.opacity}
                onChange={(e, value) => {
                  const updatedLayerList = [...layerList];
                  updatedLayerList[layerIndex] = { ...updatedLayerList[layerIndex], opacity: value as number };
                  dispatch(setLayerList(updatedLayerList))
                }}
                componentSx={{ width: '80%' }}
                sx={{ width: '56%' }}
              />
            </Stack>
          </Box>
        )
      })
      }
    </>
  )
}