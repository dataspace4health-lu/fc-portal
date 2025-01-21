"use client";
import * as React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  handleSearch: (value: string) => void; // Callback to pass selected value
}

export default function SearchBar(props: SearchBarProps) {
  const { handleSearch } = props;
  const [query, setQuery] = React.useState("");

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch(query);
    }
  };

  return (
    <TextField
      size="medium"
      variant="outlined"
      placeholder="Type key words..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyUp={handleKeyPress}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => handleSearch(query)} edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={{
        m: 2,
        width: { xs: "100%", sm: "75%", md: "50%" },
      }}
    />
  );
}
