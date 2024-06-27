import { Box, Button, Unstable_Grid2 as Grid, Popover, TextField } from "@mui/material";
import { KeyboardEvent, MouseEventHandler, ReactNode, useEffect, useState } from "react";
import Spectral_10 from "assets/jsons/Spectral_10.json"

interface ColoredSquareButtonProp {
  color: string
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined
  children?: ReactNode
}
const ColoredSquareButton = ({ color, onClick, children }: ColoredSquareButtonProp) => {
  return (
    <Box
      sx={{
        backgroundColor: color,
        width: '30px',
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 1
      }}
    >
      <Button
        disableElevation
        disableRipple
        onClick={onClick}
        sx={{
          backgroundColor: 'transparent',
          minWidth: 0,
          width: '30px',
          height: '30px',
          "&.MuiButtonBase-root:hover": {
            bgcolor: 'transparent'
          }
        }}
      />
      {children}
    </Box>
  )
}

const defaultColors = Spectral_10.colors.map(color => color.value)

export const ColorSelect = (props: { color: string, setColor: any }) => {
  const { color, setColor } = props
  const [inputValue, setInputValue] = useState(color ?? '#ffef62');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleBlur = () => {
    if (isValidColor(inputValue)) {
      setColor(inputValue);
    }
  }
  const handleKeyDown = (ev: KeyboardEvent) => {
    if (ev.key.toLowerCase() === 'enter') {
      handleBlur()
    }
  }
  const isValidColor = (value: string) => {
    const hexRegex = /^#([0-9A-F]{3}){1,2}([0-9A-F]{2})?$/i;
    const rgbaRegex = /^rgba?\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})(,\s?(0|1|0?\.\d+))?\)$/i;
    return hexRegex.test(value) || rgbaRegex.test(value);
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (color: string) => {
    setInputValue(color)
    setColor(color)
    setAnchorEl(null);
  }
  const open = Boolean(anchorEl);

  useEffect(() => {
    setInputValue(color ?? '#ffef62')
  }, [color])

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
      <TextField
        size="small"
        label="#hex or rgba(r,g,b,a)"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        sx={{
          width: '215px'
        }}
      />
      <ColoredSquareButton
        color={inputValue}
        onClick={handleOpen}
      >
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          sx={{ color: 'red' }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box padding={1}>
            <Grid container>
              {defaultColors.map(color => <Grid key={color}><ColoredSquareButton color={color} onClick={() => handleSelect(color)} /></Grid>)}
            </Grid>
          </Box>
        </Popover>
      </ColoredSquareButton>
    </Box>
  );
};
