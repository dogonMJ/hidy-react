import React from 'react'
import TextShow from './TextShow'

const { useState } = React;

type Props = {
  initText: string,
}

const TextInput = (props: Props) => {
  const [text, setText] = useState<string>('')
  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    if (e.target instanceof HTMLInputElement) {
      setText(e.target.value)
    }
  }
  return (
    <div>
      <input type="text"
        value={text}
        placeholder={props.initText}
        onChange={handleChange}
      />
      <TextShow text={text} />
    </div>
  )
}

// //匯出TextInput模組
export default TextInput