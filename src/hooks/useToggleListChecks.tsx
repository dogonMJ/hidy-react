import { onoffsSlice } from "store/slice/onoffsSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks"

export const useToggleListChecks = () => {

  const dispatch = useAppDispatch()
  const checked = useAppSelector(state => state.switches.checked)

  const handleToggleChecks = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    dispatch(onoffsSlice.actions.setChecked(newChecked))
  };
  return { checked, handleToggleChecks }
}