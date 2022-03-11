import React from "react";
import Map from 'components/Map';
import SwitchLang from 'components/SwitchLang';
import { store } from 'store/store';
import { Provider } from 'react-redux';
import "css/Map.css"
import '../../local/i18n'
function App() {
  return (
    <>
      <Provider store={store}>
        <Map />
      </Provider>
    </>
  );
}
export default App; 