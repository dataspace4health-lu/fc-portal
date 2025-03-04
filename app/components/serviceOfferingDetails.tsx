import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueCard from "./keyValueCard";
import { Box, Divider, Link } from "@mui/material";
import { formatDate } from "../utils/functions";
import LeftCard from "./sdLeftCard";

interface DetailsProps {
  sdName: string;
  sdDescription: string;
  dataProtectionRegime: string;
  policy: string;
  accessType: string;
  formatType: string;
  requestType: string;
  termsAndConditionsUrl: string;
  status: string;
  issuanceDate: string;
  statusDatetime: string;
  issuer: string;
  issuerName: string;
  issuerDescription: string;
  issuerLegalAddress: string;
  issuerHeadquarterAddress: string;
}
export default function ServiceOfferingDetailsData(props: DetailsProps) {
  const {
    sdName,
    sdDescription,
    status,
    accessType,
    formatType,
    requestType,
    policy,
    issuanceDate,
    statusDatetime,
    issuer,
    termsAndConditionsUrl,
    issuerName,
    issuerDescription,
    issuerLegalAddress,
    issuerHeadquarterAddress,
  } = props;
  // const projectList = [
  //   {
  //     key: "Project title",
  //     value: projectTitle || "-",
  //   },
  //   { key: "Project website", value: projectWebsite || "-" },
  // ];

  // const studiesList = [
  //   {
  //     key: "Study title",
  //     value: studyTitle || "-",
  //   },
  // ];

  const generalDatasetInfoList = [
    { key: "Description", value: sdDescription || "-" },
    { key: "Date of creation of the dataset", value: formatDate(issuanceDate) },
    {
      key: "Date of the last update of the dataset",
      value: formatDate(statusDatetime),
    },
    { key: "Request Type", value: requestType || "-" },
    {
      key: "Access Type",
      value: accessType || "-",
    },
    { key: "Format Type", value: formatType || "-" },
    { key: "Policy", value: policy || "-" },
  ];

  const DatasetContactsList = [
    { key: "Data Owner", value: issuerName || issuer || "-" },
    { key: "Owner Description", value: issuerDescription || "-" },
    { key: "Legal Address", value: issuerLegalAddress || "-" },
    { key: "Headquarter Address", value: issuerHeadquarterAddress || "-" },
  ];

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          alignItems: "center",
          gap: 2,
        }}
      >
        <LeftCard
          sdName={sdName}
          issuer={issuer}
          status={status}
          statusDatetime={issuanceDate}
          uploadDatetime={statusDatetime}
          issuerName={issuerName}
          disableTooltip
        />
        {/* <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button variant="contained" color="primary">
            Request access to the dataset
          </Button>
          <Button variant="contained" color="secondary">
            Download metadata
          </Button>
        </Box> */}
      </Box>

      {/* Accordion Section */}
      {[
        // { title: "Project", data: projectList },
        // { title: "Studies", data: studiesList },
        { title: "General Dataset Information", data: generalDatasetInfoList },
        { title: "Dataset contacts", data: DatasetContactsList },
        { title: "Data Sharing Agreement (DSA)", data: null },
      ].map((section, index) => (
        <Accordion
          key={index}
          defaultExpanded
          sx={{
            mb: 2,
            "&:before": { display: "none" }, // Removes the default underline
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
            sx={{
              bgcolor: "grey.100",
              "&:hover": { bgcolor: "grey.200" },
              transition: "background-color 0.3s ease",
            }}
          >
            <Typography fontWeight="bold">{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: "background.default", p: 2 }}>
            {section.data ? (
              <KeyValueCard keyValueList={section.data} />
            ) : (
              <Link href={termsAndConditionsUrl} target="_blank">
                Download document
              </Link>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" color="text.secondary" align="center">
        Last updated: {formatDate(statusDatetime)}
      </Typography>
    </Box>
  );
}
