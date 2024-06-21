import { Box, TextField } from "@mui/material";
import { KeyboardEvent, useEffect, useState } from "react";

export const ColorSelect = (props: { color: string, setColor: any }) => {
  const { color, setColor } = props
  const [inputValue, setInputValue] = useState(color ?? '#ffef62');

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
      <Box
        sx={{
          backgroundColor: inputValue,
          width: '30px',
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </Box>
  );
};
