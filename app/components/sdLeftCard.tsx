"use client";
import * as React from "react";
import { Typography, Box, Button, Tooltip } from "@mui/material";
import { formatDate } from "../utils/functions";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import { complianceResponse } from "../utils/interfaces";

interface SdLeftCardProps {
  sdName: string | undefined;
  issuer: string;
  status: string;
  statusDatetime: string;
  uploadDatetime: string;
  displayButtons?: boolean;
  issuerName: string;
  complianceCheck: complianceResponse;
}

export default function LeftCard(sdLeftCardProps: SdLeftCardProps) {
  const { sdName, issuer, status, uploadDatetime, displayButtons, issuerName, complianceCheck } =
    sdLeftCardProps;

    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    };
  

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
          {sdName || "N/A"}
        </Typography>
        {complianceCheck && <Tooltip title={complianceCheck?.message } arrow>
          {complianceCheck?.success ? <VerifiedUserIcon sx={{ color: "green" }} /> : <GppMaybeIcon sx={{ color: "red" }} />}
        </Tooltip>}
      </Box>

      {/* Data Provider with Truncation */}
      <Tooltip title={issuerName || issuer} arrow disableInteractive disableHoverListener={!!issuerName || issuer?.length <= 30}>
        <Box>
        <Typography
          // variant="h6"
          variant="body1"
          color="text.secondary"
          fontWeight="bold"
          sx={{
            // whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block",
            cursor: "pointer",
          }}
        >
          Data provider: {issuerName || truncateText(issuer, 30)}
        </Typography>
        </Box>
      </Tooltip>

      {/* Status & Creation Date */}
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

      {/* Buttons */}
      {displayButtons && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button variant="contained" color="primary">
            Request access to the dataset
          </Button>
          <Button variant="contained" color="secondary">
            Download metadata
          </Button>
        </Box>
      )}
    </Box>
  );
}
