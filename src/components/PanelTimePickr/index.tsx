import { memo } from "react";
import Flatpickr, { DateTimePickerProps } from "react-flatpickr";
import 'flatpickr/dist/plugins/monthSelect/style.css'
import flatpickr from "flatpickr";

interface PanelTimePickrProps extends DateTimePickerProps {
  defaultValues?: string[];
}
const isEqual = (prevProps: any, nextProps: any) => {
  const prev = JSON.stringify(prevProps.options)
  const next = JSON.stringify(nextProps.options)
  return prev === next ? true : false
}

export const PanelTimeRangePickr: React.FC<PanelTimePickrProps> = memo(({ options = {}, defaultValues, ...props }) => {

  const mergedOptions: flatpickr.Options.Options = {
    allowInput: true,
    weekNumbers: false,
    maxDate: new Date(),
    dateFormat: 'Y-m-d',
    altFormat: 'Y-m-d',
    ariaDateFormat: 'Y-m-d',
    mode: "range",
    ...options,
  }

  const defaultValue = (defaultValues && defaultValues.length > 0) ? `${defaultValues[0]} to ${defaultValues[1]}` : ''
  return (
    <div style={{ marginBottom: 10, marginLeft: 15 }}>
      <Flatpickr
        className='panelDatePickr'
        options={mergedOptions}
        defaultValue={defaultValue}
        {...props}
      />
    </div>
  )
}, isEqual)