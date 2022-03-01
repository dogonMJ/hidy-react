import { useTranslation } from "react-i18next";

const SwitchLang = () => {
  const { i18n } = useTranslation();
  const switchLang = (evt: React.ChangeEvent<HTMLInputElement>) => {
    i18n.changeLanguage(evt.target.value)
  }

  return (
    <div className='switchLang' onChange={switchLang}>
      <input type="radio" value="zh-TW" name="lang" defaultChecked={true} /> 中文
      <input type="radio" value="en" name="lang" /> English
    </div>
  )
}

export default SwitchLang

