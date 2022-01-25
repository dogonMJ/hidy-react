import React from "react";
import TextInput from './TextInput'
import Map from './Map'
import { store } from '../store/store';
import { Provider } from 'react-redux';
function App() {
  return (
    <>
      <Provider store={store}>
        <TextInput initText='輸入' />
        <Map />
      </Provider>
    </>
  );
}
export default App; 
