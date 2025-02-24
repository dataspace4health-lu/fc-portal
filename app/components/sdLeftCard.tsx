"use client";
import * as React from "react";
import { Typography, Box, Button } from "@mui/material";
import { formatDate } from "../utils/functions";

interface SdLeftCardProps {
  content: string | undefined;
  issuer: string;
  status: string;
  statusDatetime: string;
  uploadDatetime: string;
  displayButtons?: boolean;
}

export default function LeftCard(sdLeftCardProps: SdLeftCardProps) {
  const { content, issuer, status, uploadDatetime, displayButtons } = sdLeftCardProps;

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
          {content || "N/A"}
        </Typography>
      </Box>

      <Typography
        fontWeight="bold"
        variant="body1"
        sx={{ color: "text.secondary", mb: 1 }}
      >
        Data provider: {issuer}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          Creation date : {formatDate(uploadDatetime)}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Status:{" "}
          <span
            style={{
              color: "white",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {status === "active" ? "✅" : "❌"}
          </span>
        </Typography>
      </Box>
      {displayButtons && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button variant="contained" color="primary">
            Request access to the dataset
          </Button>
          <Button variant="contained" color="secondary">
            Download metadata
          </Button>
        </Box>)}
    </Box>
  )
}
