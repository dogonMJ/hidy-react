import { createRoot } from 'react-dom/client';
import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil } from "leaflet";
import { SwitchLang } from "components/LanguageControl/SwitchLang";
// import ReactDOM from 'react-dom';

const Language = Control.extend({
  onAdd: function (map: any) {
    const div = DomUtil.create('div', '');
    const root = createRoot(div)
    const jsx = <SwitchLang />
    root.render(jsx)
    // ReactDOM.render(jsx, div); //react 17
    return div;
  },
  onRemove: function (map: any) { },
});

export const LanguageControl = createControlComponent(
  (props) => new Language(props)
);