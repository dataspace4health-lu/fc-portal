"use client";
import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter } from "next/navigation";
import { Box } from "@mui/material";

export default function CustomSeparator() {
  const router = useRouter();
  const pathname = usePathname();

  const breadcrumbs = [
    <Typography
      key="1"
      sx={{
        cursor: "pointer",
        color: pathname === "/participant" ? "primary.main" : "text.secondary",
        fontWeight: pathname === "/participant" ? "bold" : "normal",
        fontSize: "1rem",
        "&:hover": { textDecoration: "underline", color: "primary.dark" },
        transition: "color 0.3s ease, text-decoration 0.3s ease",
      }}
      onClick={() => router.push("participant")}
    >
      Participant
    </Typography>,
    <Typography
      key="2"
      sx={{
        cursor: "pointer",
        color: pathname === "/serviceOffering" ? "primary.main" : "text.secondary",
        fontWeight: pathname === "/serviceOffering" ? "bold" : "normal",
        fontSize: "1rem",
        "&:hover": { textDecoration: "underline", color: "primary.dark" },
      }}
      onClick={() => router.push("serviceOffering")}
    >
      Data Offer
    </Typography>,
  ];

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "background.paper",
        borderRadius: 1,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Breadcrumbs
        separator="|"
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: "text.disabled",
            fontWeight: "bold",
          },
        }}
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Box>
  );
}
