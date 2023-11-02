import { CSSProperties } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  style?: CSSProperties | undefined
}
export const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && children}
    </div>
  );
}