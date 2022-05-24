import { createControlComponent } from "@react-leaflet/core";
import ReactDOM from 'react-dom';
import { Control, DomUtil } from "leaflet";
import SwitchLang from "components/SwitchLang";

const Language = Control.extend({
  onAdd: function (map: any) {
    const div = DomUtil.create('div', '');
    const jsx = <SwitchLang />
    ReactDOM.render(jsx, div);
    return div;
  },
  onRemove: function (map: any) { },
});

export const LanguageControl = createControlComponent(
  (props) => new Language(props)
);