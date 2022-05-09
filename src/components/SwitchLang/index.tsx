import { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTranslation } from "react-i18next";

const SwitchLang = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState('zh-TW');

  const handleSwitch = (
    event: React.MouseEvent<HTMLElement>,
    newLang: string | null,
  ) => {
    if (newLang !== null) {
      setLang(newLang);
      i18n.changeLanguage(newLang)
    }
  };

  return (
    <ToggleButtonGroup
      size="small"
      value={lang}
      exclusive
      onChange={handleSwitch}
      className='button'
    >
      <ToggleButton value="zh-TW" aria-label='中文' className='langBtn'>
        中文
      </ToggleButton>
      <ToggleButton value="en" aria-label='EN' className='langBtn'>
        EN
      </ToggleButton>
    </ToggleButtonGroup>
  );
}


export default SwitchLang