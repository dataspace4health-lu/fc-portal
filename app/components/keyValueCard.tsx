import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

interface KeyValueList {
  key: string;
  value: string;
}

interface KeyValueCardProps {
  keyValueList: KeyValueList[];
}

export default function KeyValueCard(props: KeyValueCardProps) {
  const { keyValueList } = props;
  return (
    <Box sx={{ flexGrow: 1 }}>
      {keyValueList.map((ele) => (
        <Grid container spacing={2} key={ele.key} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6, md: 4 }}>{ele.key}</Grid>
          <Grid size={{ xs: 6, md: 8 }}>{ele.value}</Grid>
        </Grid>
      ))}
    </Box>
  );
}
