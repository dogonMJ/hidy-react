import React from "react";
import Map from 'components/Map';
import { store } from 'store/store';
import { Provider } from 'react-redux';
import "css/Map.css"
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
