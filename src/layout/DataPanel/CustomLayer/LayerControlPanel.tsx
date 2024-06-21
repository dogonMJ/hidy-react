import { Stack, Box, Typography, IconButton, Button, Popover } from "@mui/material"
import LayersClearIcon from '@mui/icons-material/LayersClear';
import { memo, useEffect, useState } from "react";
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

const numberToAlphaHex = (number: number) => {
  const alphaValue = Math.round((number / 100) * 255);
  const alphaHex = alphaValue.toString(16).toUpperCase();
  return alphaHex.padStart(2, '0');
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
  const [layerColors, setLayerColors] = useState<string[]>([''])

  const handlePopover = (event: React.MouseEvent<HTMLButtonElement>, layerName: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedLayer(layerName);
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedLayer(null);
  };

  const handleColorChange = (index: number, newColor: string) => {
    let opacity = 100;
    if (newColor.startsWith('#') && newColor.length === 9) {
      opacity = Math.round(parseInt(newColor.slice(-2), 16) * 100 / 255)
    } else {
      const rgbaMatch = newColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (rgbaMatch) {
        const [_, r, g, b, a] = rgbaMatch;
        opacity = Math.round(Number(a) * 100)
      }
    }
    const updatedLayerList = layerList.map((layer, i) => {
      if (i === index) {
        return {
          ...layer,
          color: newColor,
          opacity: opacity
        };
      }
      return layer;
    });
    isDispatch ? dispatch(setLayerList(updatedLayerList)) : setLayerList(updatedLayerList)
  };


  useEffect(() => {
    setLayerColors(layerList.map(layer => layer.color as string));
  }, [layerList]);

  return (
    <>
      {layerList.map((layer, index) => {
        const layerIndex = layerList.findIndex(item => item.name === layer.name);
        return (
          <Box key={`${layer.name}_${index}`} sx={{ border: 1, padding: 1, marginTop: 1, borderRadius: 1, borderColor: '#C0C0C0' }}>
            <Button
              size="small"
              sx={{ maxWidth: '100%', textTransform: 'none', justifyContent: 'flex-start' }}
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
              <Stack spacing={2} width={'100%'}>
                {isOpacity && <OpacitySlider
                  opacity={layer.opacity ?? 100}
                  onChange={(e, value) => {
                    const opacityValue = value as number
                    if (isColorSelect) {
                      const newColors = [...layerColors];
                      const color = newColors[index];
                      let newColor = color
                      if (color.startsWith('#')) {
                        const newAlpha = numberToAlphaHex(opacityValue)
                        if (color.length === 7) {
                          newColor = newColor + newAlpha
                        } else if (color.length === 9) {
                          newColor = newColor.slice(0, 7) + newAlpha
                        }
                      } else {
                        const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                        if (rgbaMatch) {
                          const [_, r, g, b] = rgbaMatch;
                          newColor = `rgba(${r}, ${g}, ${b}, ${opacityValue / 100})`;
                        }
                      }
                      handleColorChange(index, newColor)
                    } else {
                      const updatedLayerList = [...layerList];
                      updatedLayerList[layerIndex] = { ...updatedLayerList[layerIndex], opacity: opacityValue };
                      isDispatch ? dispatch(setLayerList(updatedLayerList)) : setLayerList(updatedLayerList)
                    }
                  }}
                  componentSx={{ width: '80%' }}
                  sx={{ width: '56%' }}
                />
                }
                {isColorSelect &&
                  <ColorSelect
                    color={layerColors[index]}
                    setColor={(newColor: string) => handleColorChange(index, newColor)}
                  />
                }
              </Stack>
            </Stack>
          </Box>
        )
      })
      }
    </>
  )
})