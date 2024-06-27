import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { getLayerData } from "Utils/UtilsImportFiles";
import { addFileSlice } from "store/slice/addFileSlice";
import { onoffsSlice } from "store/slice/onoffsSlice";

export const DragDrop = () => {
  const dispatch = useAppDispatch()
  const mapContainer = document.getElementById('mapContainer')

  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
  };

  const checked = useAppSelector(state => state.switches.checked)
  const handleDrop = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      const data = await getLayerData([...e.dataTransfer.files])
      dispatch(onoffsSlice.actions.setChecked([...checked, 'addFile']))
      dispatch(addFileSlice.actions.setFileList(data))
    }
  }

  if (mapContainer) {
    mapContainer.ondrop = handleDrop
    mapContainer.ondragover = handleDrag //must for drop
  }

  return (null)
}