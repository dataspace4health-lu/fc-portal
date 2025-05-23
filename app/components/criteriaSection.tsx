import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import { Link, Tooltip } from "@mui/material";

interface Evidence {
  "gx:website"?: string;
  "gx:pdf"?: string;
}

interface KeyValueList {
  name: string;
  description: string;
  response: string;
  reason?: string;
  evidence?: Evidence;
}

interface KeyValueCardProps {
  list: KeyValueList[];
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

const displayIcon = (response: string) => {
  switch (response) {
    case "Confirm":
      return <CheckCircleIcon sx={{ color: "green" }} />;
    case "Deny":
      return <CancelIcon sx={{ color: "red" }} />;
    default:
      return <ErrorIcon sx={{ color: "orange" }} />;
  }
};

export default function CriteriaSection(props: KeyValueCardProps) {
  const { list } = props;

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
      <Grid container spacing={2} sx={{ mb: 2, alignItems: "center" }}>
        <Grid size={{ xs: 1, md: 1 }}>
          <KeyContainer variant="body2">Name</KeyContainer>
        </Grid>
        <Grid size={{ xs: 8, md: 8 }}>
          <KeyContainer variant="body2">Description</KeyContainer>
        </Grid>
        <Grid size={{ xs: 1, md: 1 }} display="flex" justifyContent="center">
          <KeyContainer variant="body2">Response</KeyContainer>
        </Grid>
        <Grid size={{ xs: 1, md: 1 }}>
          <KeyContainer variant="body2">Website</KeyContainer>
        </Grid>
        <Grid size={{ xs: 1, md: 1 }}>
          <KeyContainer variant="body2">PDF</KeyContainer>
        </Grid>
      </Grid>
      {list.map((ele) => (
        <Grid
          container
          spacing={2}
          key={ele.name}
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
          <Grid size={{ xs: 1, md: 1 }}>
            <KeyContainer variant="body2">{ele.name}</KeyContainer>
          </Grid>
          <Grid size={{ xs: 8, md: 8 }}>
            <ValueContainer variant="body2">{ele.description}</ValueContainer>
          </Grid>
          <Grid size={{ xs: 1, md: 1 }} display="flex" justifyContent="center">
            <ValueContainer variant="body2">
              <Tooltip title={ele.reason} arrow>
                {displayIcon(ele.response)}
              </Tooltip>
            </ValueContainer>
          </Grid>
          {/* <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center">
            <ValueContainer variant="body2">{ele.reason}</ValueContainer>
          </Grid> */}
          <Grid size={{ xs: 1, md: 1 }}>
            {ele.evidence && ele.evidence["gx:website"] && (
              <ValueContainer variant="body2">
                <Link href={ele.evidence["gx:website"]} target="_blank">
                  Website
                </Link>
              </ValueContainer>
            )}
          </Grid>
          <Grid size={{ xs: 1, md: 1 }}>
            {ele.evidence && ele.evidence["gx:pdf"] && (
              <ValueContainer variant="body2">
                <Link href={ele.evidence["gx:pdf"]} target="_blank">
                  PDF
                </Link>
              </ValueContainer>
            )}
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}
