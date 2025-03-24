"use client";
import * as React from "react";
import { Typography, Box, Tooltip } from "@mui/material";
import { complianceResponse } from "../utils/interfaces";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
interface LeftCardProps {
  name: string;
  id: string;
  logoUrl?: string; // Optional logo URL
  address: string;
  lrnType: string | undefined;
  lrnCode: string;
  complianceCheck: complianceResponse;
}

export default function LeftCard(leftCardProps: LeftCardProps) {
  const { name, id, address, complianceCheck, lrnCode, lrnType } = leftCardProps;

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
        <Tooltip title={complianceCheck.message } arrow>
          {complianceCheck.success ? <VerifiedUserIcon sx={{ color: "green" }} /> : <GppMaybeIcon sx={{ color: "red" }} />}
        </Tooltip>
        {/* {logoUrl ? (
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
        )} */}
      </Box>

      <Typography
        fontWeight="bold"
        variant="body1"
        sx={{ color: "text.secondary", mb: 1 }}
      >
        DS4H ID: {id}
      </Typography>

      <Box >
        <Typography variant="body1" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
          Address: {address}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {lrnType}: {lrnCode}
          {/* <span
            style={{
              color: "white",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {complianceCheck.success  ? "✅" : "❌"}
          </span> */}
        </Typography>
      </Box>
    </Box>
  );
}
