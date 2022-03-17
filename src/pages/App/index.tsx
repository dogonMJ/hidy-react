import React from "react";
import Map from 'components/Map';
import { store } from 'store/store';
import { Provider } from 'react-redux';
import "css/Map.css"
import '../../local/i18n'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material'


function App() {
  const theme = createTheme({
    typography: {
      fontFamily: [
        "Rubik",
        "sans-serif"
      ].join(",")
    }
  });
  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Map />
        </ThemeProvider>
      </Provider>
    </>
  );
}
export default App; 