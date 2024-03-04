import { onoffsSlice } from "store/slice/onoffsSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useSingleComponentCheck = () => {
  const dispatch = useAppDispatch()
  const checked = useAppSelector(state => state.switches.checked)
  const addCheckedComponent = (name: string) => {
    if (!checked.includes(name)) {
      const newChecked = [...checked];
      newChecked.push(name);
      dispatch(onoffsSlice.actions.setChecked(newChecked))
    }
  }
  const removeCheckedComponent = (name: string) => {
    const oldChecked = [...checked]
    dispatch(onoffsSlice.actions.setChecked(oldChecked.filter(chk => chk !== name)))
  }
  return { addCheckedComponent, removeCheckedComponent }
}

