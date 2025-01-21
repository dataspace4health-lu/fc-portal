import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface SelectInputOptions {
  id: string;
  label: string;
}

interface SelectInputProps {
  options: SelectInputOptions[];
  fieldLabel: string;
  onValueChange?: (value: SelectInputOptions | null) => void; // Callback to pass selected value
}

export default function SelectInput(props: SelectInputProps) {
  const { options, fieldLabel, onValueChange } = props;


  return (
    <Autocomplete
      disablePortal
      options={options}
      getOptionLabel={(option) => option.label} // Specifies what to display
      isOptionEqualToValue={(option, value) => option.id === value.id} // Ensures unique comparison
      sx={{ width: 300, m: 2 }}
      onChange={(event, value) => onValueChange && onValueChange(value)} // Capture value on change
      renderInput={(params) => <TextField {...params} label={fieldLabel} />}
    />
  );
}
