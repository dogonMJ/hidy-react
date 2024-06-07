import { Stack, Box, Typography, IconButton, Button, Popover } from "@mui/material"
import LayersClearIcon from '@mui/icons-material/LayersClear';
import { useState } from "react";
import { OpacitySlider } from "components/OpacitySlider";
import { useAppDispatch } from "hooks/reduxHooks";
import { useMap } from "react-leaflet";
import { ColorSelect } from "components/ColorSelect/ColorSelect";

interface LayerControlPanelProp {
  layerList: any[]
  setLayerList: any
  isAddFile?: boolean
}
export const LayerControlPanel: React.FC<LayerControlPanelProp> = ({ layerList, setLayerList, isAddFile = false }) => {
  const dispatch = useAppDispatch()
  const map = useMap()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const initColor = layerList[0].getLayers()[0].options.fillColor || layerList[0].getLayers()[0].options.color
  const [color, setColor] = useState(initColor)

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
          <Box key={`${layer.name}_${index}`} sx={{ border: 1, padding: 1, borderRadius: 1, borderColor: '#C0C0C0' }}>
            <Button
              size="small"
              sx={{ maxWidth: '100%', textTransform: 'none', justifyContent: 'flex-start' }}
              onClick={isAddFile ? undefined : (event) => handlePopover(event, layer.name)}
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
                  if (isAddFile) {
                    map.removeLayer(layerList[index])
                    setLayerList(layerList.filter((_, i) => i !== index))
                  } else {
                    dispatch(setLayerList(layerList.filter((_, i) => i !== index)))
                  }
                }}
              >
                <LayersClearIcon />
              </IconButton>
              {!isAddFile && <OpacitySlider
                opacity={layer.opacity}
                onChange={(e, value) => {
                  const updatedLayerList = [...layerList];
                  updatedLayerList[layerIndex] = { ...updatedLayerList[layerIndex], opacity: value as number };
                  dispatch(setLayerList(updatedLayerList))
                }}
                componentSx={{ width: '80%' }}
                sx={{ width: '56%' }}
              />
              }
              {isAddFile &&
                // <div
                //   key={index}
                //   style={{
                //     backgroundColor: layer.getLayers()[0].options.fillColor || layer.getLayers()[0].options.color,
                //     width: `100px`,
                //     height: '15px',
                //     display: 'flex',
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //   }}
                //    />
                <ColorSelect color={color} setColor={setColor} />
              }
            </Stack>
          </Box>
        )
      })
      }
    </>
  )
}