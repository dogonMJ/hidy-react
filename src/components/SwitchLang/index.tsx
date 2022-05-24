import { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from "react-i18next";
import { Button } from '@mui/material';

const SwitchLang = () => {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = useState('zh-TW');
  // const handleSwitch = (
  //   event: any,//React.MouseEvent<HTMLElement>,
  //   newLang: string | null,
  // ) => {
  //   console.log(newLang)
  //   if (newLang) {
  //     setLang(newLang);
  //     i18n.changeLanguage(newLang)
  //   }
  // };
  const handleSwitch = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLInputElement
    switch (target.value) {
      case 'zh-TW':
        setLang('en')
        i18n.changeLanguage('en')
        break;
      case 'en':
        setLang('zh-TW')
        i18n.changeLanguage('zh-TW')
        break;
      default:
        setLang('zh-TW')
        i18n.changeLanguage('zh-TW')
    }
  }
  return (
    // <ToggleButtonGroup
    //   size="small"
    //   value={lang}
    //   exclusive
    //   onChange={handleSwitch}
    //   sx={{
    //     right: 5,
    //     backgroundColor: 'white',
    //   }}
    // >
    //   <ToggleButton value="zh-TW" aria-label='中文' className='langBtn'>
    //     中文
    //   </ToggleButton>
    //   <ToggleButton value="en" aria-label='EN' className='langBtn'>
    //     EN
    //   </ToggleButton>
    // </ToggleButtonGroup>
    <ToggleButtonGroup
      size="small"
      value={lang}
      exclusive
      onChange={handleSwitch}
      sx={{
        right: 5,
        backgroundColor: 'white',
        width: '45px',
        height: '25px',
      }}
    >
      <ToggleButton value={lang} sx={{
        width: '95px',
        fontFamily: 'Rubik',
        "&.Mui-selected":
          { background: 'white' }
      }}>
        {t('switchLang')}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default SwitchLang