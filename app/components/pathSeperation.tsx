import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

export default function CustomSeparator() {

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/participant"
    >
      Participant
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/serviceOffering">
      Data Offer
    </Link>,
  ];

  return (
    <Breadcrumbs separator="|" aria-label="breadcrumb" sx={{ m: 2 }}>
      {breadcrumbs}
    </Breadcrumbs>
  );
}
