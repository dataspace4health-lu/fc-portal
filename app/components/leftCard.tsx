"use client";
import * as React from "react";
import { Paper, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

interface LeftCardProps {
  name: string;
  id: string;
  logoUrl?: string; // Optional logo URL
  address: string;
  vatNumber: string;
}

export default function LeftCard(leftCardProps: LeftCardProps) {
  const { name, id, logoUrl, address, vatNumber } = leftCardProps;
  console.log("logoUrl", logoUrl);

  return (
    // <Paper
    //   elevation={3}
    //   sx={{
    //     p: 3,
    //     borderRadius: 2,
    //     bgcolor: "background.default",
    //     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    //     "&:hover": {
    //       boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    //     },
    //   }}
    // >
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${name} logo`}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #ccc",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  bgcolor: "grey.300",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                N/A
              </Box>
            )}
            <Typography variant="h6" fontWeight="bold">
              {name}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
            DS4H ID: <strong>{id}</strong>
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
            VAT Number: <strong>{vatNumber}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" sx={{ mt: 2, color: "text.primary" }}>
            Address: {address}
          </Typography>
        </Grid>
      </Grid>
    // </Paper>
  );
}
