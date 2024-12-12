"use client";
import * as React from "react";
import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
// import Image from "next/image";

interface LeftCardProps {
  name: string;
  id: string;
  logoUrl: string;
  address: string;
  vatNumber: string;
}

export default function LeftCard(leftCardProps: LeftCardProps) {
  const { name, id, logoUrl, address, vatNumber } = leftCardProps;
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Grid
        id={id}
        container
        spacing={2}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "space-between",
        }}
      >
        <Grid size={6}>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="h6">DS4HID: {id}</Typography>
        </Grid>
        <Grid size={6}>
          {/* <Image
          src={logoUrl}
          width={20}
          height={20}
          alt={id}
        /> */}
        </Grid>
        <Grid size={6}>
          <Typography>{address}</Typography>
        </Grid>
        <Grid size={6}>
          <Typography>VAT Number {vatNumber}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
