import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";

interface KeyValueList {
  key: string;
  value: string;
}

interface KeyValueCardProps {
  keyValueList: KeyValueList[];
}

const KeyContainer = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

const ValueContainer = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  color: theme.palette.text.primary,
  wordBreak: "break-word",
}));

export default function KeyValueCard(props: KeyValueCardProps) {
  const { keyValueList } = props;

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 1,
      }}
    >
      {keyValueList.map((ele) => (
        <Grid
          container
          spacing={2}
          key={ele.key}
          sx={{
            mb: 2,
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 1,
            "&:last-child": {
              borderBottom: "none",
              pb: 0,
            },
          }}
        >
          <Grid size={{ xs: 6, md: 4 }}>
            <KeyContainer variant="body2">{ele.key}</KeyContainer>
          </Grid>
          <Grid size={{ xs: 6, md: 8 }}>
            {ele.key === "Description" ? (
              <ReactMarkdown>{ele.value}</ReactMarkdown>
            ) : (
              <ValueContainer variant="body2">{ele.value}</ValueContainer>
            )}
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}
