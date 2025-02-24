"use client";
import * as React from "react";
import { Typography, Box } from "@mui/material";
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {name}
        </Typography>
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
      </Box>

      <Typography
        fontWeight="bold"
        variant="body1"
        sx={{ color: "text.secondary", mb: 1 }}
      >
        DS4H ID: {id}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          Address: {address}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          VAT Number:{" "}
          <span
            style={{
              color: "white",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {vatStatus === "valid" ? "✅" : "❌"}
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
