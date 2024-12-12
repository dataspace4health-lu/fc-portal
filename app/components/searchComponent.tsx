'use client';
import * as React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar() {
  const [query, setQuery] = React.useState('');

  const handleSearch = () => {
    console.log('Search query:', query);
    // Perform search logic here
  };

  return (
    <TextField
    size='medium'
      variant="outlined"
      placeholder="Type key words..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      slotProps={{
        input: {
            endAdornment: <InputAdornment position="end">
            <IconButton onClick={handleSearch} edge="end">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      }}
      sx={{
        m: 2,
        width: { xs: '100%', sm: '75%', md: '50%' },
      }}
    />
  );
}
