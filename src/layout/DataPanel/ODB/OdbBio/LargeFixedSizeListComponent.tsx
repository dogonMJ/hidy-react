import { createContext, forwardRef, useContext } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Typography from '@mui/material/Typography';


const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
  };
  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {`${dataSet[1]}`}
    </Typography>
  );
}

export const LargeFixedSizeListComponent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  const { children, ...other } = props;
  const itemCount = (children as React.ReactNode[]).length
  return (
    <div ref={ref} >
      <OuterElementContext.Provider value={other} >
        <FixedSizeList
          itemData={children}
          height={200}
          width='100%'
          itemSize={40}
          innerElementType="ul"
          outerElementType={OuterElementType}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});