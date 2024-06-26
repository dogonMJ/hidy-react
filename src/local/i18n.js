import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
import en from "./language/en.json";
import tw from "./language/zh-TW.json";
import { readUrlQuery, toIETF } from 'Utils/UtilsStates';
const query = readUrlQuery('map')
const initLang = query && query.lang && toIETF(query.lang) === 'en' ? 'en' : 'zh-TW'

const resources = {
  "en": {
    translation: en,
  },
  "zh-TW": {
    translation: tw,
  },
};

export default i18n
  // .use(LanguageDetector) //偵測瀏覽器語言
  .use(initReactI18next)
  .init({
    lng: initLang, //預設語言
    fallbackLng: "en", // 若當前語言沒有對應的翻譯則使用這個語言
    resources, //引入字典檔
    returnNull: false,
    interpolation: {
      // 是否要讓字詞 escaped 來防止 xss 攻擊，因為 React.js 已經做了，這裡設成 false
      escapeValue: false,
    },
  });