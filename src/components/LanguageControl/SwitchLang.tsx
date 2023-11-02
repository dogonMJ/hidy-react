import { useState } from 'react';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import { IconButton } from '@mui/material';
import { useTranslation } from "react-i18next";

export const SwitchLang = () => {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = useState('zh-TW');
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
    <div className='leaflet-bar bg-white' tabIndex={-1}>
      <IconButton
        aria-label={`${t('translation.title')}`}
        title={`${t('translation.title')}`}
        value={lang}
        onClick={handleSwitch}
        sx={{
          width: 30,
          height: 30,
          borderRadius: 0,
          // fontFamily: 'Rubik',
          // fontSize: '5px',
          // fontWeight: 900
        }}
      >
        <TranslateRoundedIcon fontSize="small" />
        {/* {t('switchLang')} */}
      </IconButton>
    </div>
  );
}
