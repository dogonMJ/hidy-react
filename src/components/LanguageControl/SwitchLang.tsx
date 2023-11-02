import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import { IconButton } from '@mui/material';
import { useTranslation } from "react-i18next";

export const SwitchLang = () => {
  const { i18n, t } = useTranslation();
  const handleSwitch = () => {
    const language = i18n.language
    switch (language) {
      case 'zh-TW':
        i18n.changeLanguage('en')
        break;
      case 'en':
        i18n.changeLanguage('zh-TW')
        break;
      default:
        i18n.changeLanguage('zh-TW')
    }
  }
  return (
    <div className='leaflet-bar bg-white' tabIndex={-1}>
      <IconButton
        aria-label={`${t('translation.title')}`}
        title={`${t('translation.title')}`}
        onClick={handleSwitch}
        sx={{
          width: 30,
          height: 30,
          borderRadius: 0,
        }}
      >
        <TranslateRoundedIcon fontSize="small" />
        {/* {t('switchLang')} */}
      </IconButton>
    </div>
  );
}
