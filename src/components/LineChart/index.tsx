import Plot from 'react-plotly.js';
import Draggable from 'react-draggable';
import React, { useRef, forwardRef, useState } from 'react';
import { Pane, useMap } from 'react-leaflet';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, } from '@mui/material';
import { PlotParams } from "react-plotly.js";

export const LineChart = forwardRef((
  props: {
    plotProps: PlotParams
    paneName: string
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    positionOffset?: { x: number, y: number }
    hover?: (data: Plotly.PlotHoverEvent) => void
    unhover?: (data: Plotly.PlotMouseEvent) => void
  }
  , ref: any,) => {
  const nodeRef = useRef(null)
  const map = useMap()
  const [disableDrag, setDisableDrag] = useState(false)
  const { data, layout, config } = props.plotProps
  const offset = props.positionOffset ? props.positionOffset : { x: -400, y: 60 }
  const layerCenterPoint = map.latLngToLayerPoint(map.getBounds().getCenter())

  const disableMapAction = () => {
    map.dragging.disable()
    map.scrollWheelZoom.disable()
  }
  const enableMapAction = () => {
    map.dragging.enable()
    map.scrollWheelZoom.enable()
  }

  const onClose = () => {
    enableMapAction()
    props.setOpen(false)
  }

  return (
    <Pane name={props.paneName} style={{ zIndex: 800 }}>
      <Draggable
        nodeRef={nodeRef}
        // defaultClassName={'DefaultDraggable'}
        defaultPosition={{ x: layerCenterPoint.x + offset.x, y: layerCenterPoint.y + offset.y }}
        disabled={disableDrag}
        onStop={(e) => e.stopPropagation()}
      >
        <div ref={nodeRef} id={props.paneName}>
          <div
            onMouseLeave={enableMapAction}
            onMouseEnter={disableMapAction}
            style={{
              backgroundColor: '#e0e0e0',
              width: layout.width,
              height: 40,
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                display: 'flex',
                marginLeft: 'auto',
                marginRight: 0
              }}>
              <CloseIcon />
            </IconButton>
          </div>
          <div
            onMouseEnter={() => {
              setDisableDrag(true)
              disableMapAction()
            }}
            onMouseLeave={() => {
              setDisableDrag(false)
              enableMapAction()
            }}
          >
            <Plot
              ref={ref}
              data={data}
              layout={layout}
              config={config}
              onHover={(evt) => {
                if (props.hover) {
                  props.hover(evt)
                }
              }}
              onUnhover={(evt) => {
                if (props.unhover) {
                  props.unhover(evt)
                }
              }}
            />
          </div>
        </div>
      </Draggable >
    </Pane >
  )
})