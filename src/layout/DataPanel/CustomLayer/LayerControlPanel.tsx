import { Stack, Box, Typography, IconButton, Button, Popover } from "@mui/material"
import LayersClearIcon from '@mui/icons-material/LayersClear';
import { memo, useState } from "react";
import { OpacitySlider } from "components/OpacitySlider";
import { useAppDispatch } from "hooks/reduxHooks";
import { useMap } from "react-leaflet";
import { ColorSelect } from "components/ColorSelect/ColorSelect";

interface LayerControlPanelProp {
  layerList: any[]
  setLayerList: any
  isDispatch?: boolean
  isOpacity?: boolean
  isColorSelect?: boolean
  clickName?: 'popOverUrl' | 'fitBounds' | 'text'
  fitBoundLayers?: any[]
}
export const LayerControlPanel: React.FC<LayerControlPanelProp> = memo(({
  layerList,
  setLayerList,
  isDispatch = true,
  isOpacity = true,
  isColorSelect = false,
  clickName = 'popOverUrl',
  fitBoundLayers
}) => {
  const dispatch = useAppDispatch()
  const map = useMap()
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
  const handleColorChange = (index: number, newColor: string) => {
    const updatedLayerList = layerList.map((layer, i) => {
      if (i === index) {
        return {
          ...layer,
          color: newColor
        };
      }
      return layer;
    });
    isDispatch ? dispatch(setLayerList(updatedLayerList)) : setLayerList(updatedLayerList)
  };
  return (
    <>
      {layerList.map((layer, index) => {
        const layerIndex = layerList.findIndex(item => item.name === layer.name);
        return (
          <Box key={`${layer.name}_${index}`} sx={{ border: 1, padding: 1, marginTop: 1, borderRadius: 1, borderColor: '#C0C0C0' }}>
            <Button
              size="small"
              sx={{ maxWidth: '100%', textTransform: 'none', justifyContent: 'flex-start' }}
              // onClick={isColorSelect ? undefined : (event) => handlePopover(event, layer.name)}
              onClick={(event) => {
                switch (clickName) {
                  case 'popOverUrl':
                    return handlePopover(event, layer.name)
                  case 'text':
                    return undefined
                  case 'fitBounds':
                    if (fitBoundLayers && fitBoundLayers.length > 0) {
                      map.fitBounds(fitBoundLayers[index].getBounds())
                    }
                    break
                }
              }}
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
            <Stack direction={'row'} alignItems={'center'}>
              <IconButton
                color={'error'}
                onClick={() => {
                  isDispatch ? dispatch(setLayerList(layerList.filter((_, i) => i !== index))) : setLayerList(layerList.filter((_, i) => i !== index))
                }}
              >
                <LayersClearIcon />
              </IconButton>
              {isOpacity && <OpacitySlider
                opacity={layer.opacity}
                onChange={(e, value) => {
                  const updatedLayerList = [...layerList];
                  updatedLayerList[layerIndex] = { ...updatedLayerList[layerIndex], opacity: value as number };
                  isDispatch ? dispatch(setLayerList(updatedLayerList)) : setLayerList(updatedLayerList)
                }}
                componentSx={{ width: '80%' }}
                sx={{ width: '56%' }}
              />
              }
              {isColorSelect &&
                <ColorSelect
                  color={layer.color}
                  setColor={(newColor: string) => handleColorChange(index, newColor)}
                />
              }
            </Stack>
          </Box>
        )
      })
      }
    </>
  )
})