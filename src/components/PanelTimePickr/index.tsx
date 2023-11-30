import { memo, useMemo } from "react";
import Flatpickr, { DateTimePickerProps } from "react-flatpickr";
import 'flatpickr/dist/plugins/monthSelect/style.css'
import flatpickr from "flatpickr";

interface PanelTimePickrProps extends DateTimePickerProps {
  minDate?: string | Date
}

export const PanelTimePickr: React.FC<PanelTimePickrProps> = memo(({ options = {}, minDate, ...props }) => {
  // 避免options prop傳入會re-render (shallow compare)，minDate獨立為prop
  const mergedOptions: flatpickr.Options.Options = {
    allowInput: true,
    weekNumbers: false,
    maxDate: new Date(),
    dateFormat: 'Y-m-d',
    altFormat: 'Y-m-d',
    ariaDateFormat: 'Y-m-d',
    mode: "range",
    minDate: minDate,
    ...options,
  }

  return (
    <div style={{ marginBottom: 10, marginLeft: 15 }}>
      <Flatpickr
        className='panelDatePickr'
        options={mergedOptions}
        {...props}
      />
    </div>
  )
}
)