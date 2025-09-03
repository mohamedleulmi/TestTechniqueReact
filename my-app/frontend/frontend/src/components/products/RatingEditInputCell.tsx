import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { type GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';

export function RatingEditInputCell(props: GridRenderCellParams<number>) {
  const { id, field, value, hasFocus } = props;
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLDivElement>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number | null) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue ?? 0 });
  };

  useEnhancedEffect(() => {
    if (hasFocus && ref.current) {
      const input = ref.current.querySelector<HTMLInputElement>(`input[value="${value}"]`);
      input?.focus();
    }
  }, [hasFocus, value]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }} ref={ref}>
      <Rating
        name="rating"
        precision={1}
        value={value ?? 0}
        onChange={handleChange}
      />
    </Box>
  );
}
