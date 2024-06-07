import { Box, TextField } from "@mui/material";
import { useState } from "react";

export const ColorSelect = (props: { color: string, setColor: any }) => {
  // const [color, setColor] = useState('#000000');
  const { color, setColor } = props
  const [inputValue, setInputValue] = useState(color);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setInputValue(value);
    if (isValidColor(value)) {
      setColor(value);
    }
  };

  const isValidColor = (value: string) => {
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    const rgbaRegex = /^rgba?\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})(,\s?(0|1|0?\.\d+))?\)$/i;
    return hexRegex.test(value) || rgbaRegex.test(value);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
      <TextField
        size="small"
        label="#hex or rgba(r,g,b,a)"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
        sx={{
          width: '205px'
        }}
      />
      <Box
        sx={{
          backgroundColor: color,
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
