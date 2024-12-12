import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface SelectInputOptions {
    id: string;
    label: string;
}

interface SelectInputProps {
    options: SelectInputOptions[]
    fieldLabel: string
    
  }

export default function SelectInput(props: SelectInputProps) {
    const {options, fieldLabel} = props

  return (
    <Autocomplete
      disablePortal
      options={options}
      sx={{ width: 300, m: 2 }}
      renderInput={(params) => <TextField {...params} label={fieldLabel} />}
    />
  );
}