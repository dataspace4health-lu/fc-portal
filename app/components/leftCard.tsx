"use client";
import * as React from "react";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";

interface LeftCardProps {
  name: string;
  id: string;
  logoUrl?: string; // Optional logo URL
  address: string;
  vatNumber: string;
  vatStatus: string;
}

export default function LeftCard(leftCardProps: LeftCardProps) {
  const { name, id, logoUrl, address, vatStatus } = leftCardProps;

  return (
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
            <Image alt={`${name} logo`} src={logoUrl} width={50} height={50} />
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
          VAT Number:{" "}
          <span
            style={{
              // backgroundColor: vatStatus === "valid" ? "green" : "red",
              color: "white",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {vatStatus === "valid" ? "✅" : "❌"}
          </span>
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" sx={{ mt: 2, color: "text.primary" }}>
          Address: {address}
        </Typography>
      </Grid>
    </Grid>
  );
}
