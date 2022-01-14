import React, { useEffect, useState } from "react";
import TextInput from './TextInput'
import Map from './Map'
function App() {
  // const [datetime, setDatetime] = useState(new Date());
  // console.log(datetime)
  return (
    <div>

      <TextInput initText='輸入' />
      <Map />

    </div>
  );
}
export default App; //輸出App函式
