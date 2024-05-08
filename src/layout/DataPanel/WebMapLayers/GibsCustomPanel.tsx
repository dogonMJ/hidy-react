// import wmList from 'assets/jsons/WebMapsList.json'
import { Box, Divider, } from "@mui/material"
import { OpacitySlider } from "components/OpacitySlider"
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks"
import { WmProps, webmapSlice } from "store/slice/webmapSlice"

export const GibsCustomPanel = (props: { identifier: string }) => {
  const { identifier } = props
  const dispatch = useAppDispatch()
  const wmProps = useAppSelector(state => state.webmap[identifier])
  const opacity = (wmProps?.opacity || wmProps?.opacity === 0) ? wmProps.opacity as number : 100

  const handleOpacityChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number
    const newWmProps: WmProps = Object.assign({}, { ...wmProps, opacity: value })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }

  return (
    <>
      <Divider variant="middle" />
      <Box sx={{ margin: 2 }}>
        <OpacitySlider opacity={opacity} onChange={handleOpacityChange} />
      </Box >
      <Divider variant="middle" />
    </>
  )
}