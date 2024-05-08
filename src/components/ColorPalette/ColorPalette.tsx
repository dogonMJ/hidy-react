import { Stack } from '@mui/material';
import { getColorWithInterval } from 'Utils/UtilsODB';
interface ColorPaletteLegendProps {
  palette: string[];
  interval?: number;
  fullLength?: number
}
export const ColorPalette: React.FC<ColorPaletteLegendProps> = ({ palette, interval, fullLength }) => {
  const fullWidth = fullLength ? fullLength : 180
  const colors = interval || interval === 0 ? getColorWithInterval(palette, interval + 2) : palette
  const width = interval || interval === 0 ? fullWidth / (interval + 2) : fullWidth ? fullWidth / palette.length : 10
  return (
    <Stack direction={'row'} justifyContent={'center'}>
      {colors.map((color, index) => (
        <div key={index} style={{ backgroundColor: color, width: `${width}px`, height: '15px', marginTop: '4px' }}></div>
      ))}
    </Stack>
  );
}