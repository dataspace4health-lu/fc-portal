import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueCard from "./keyValueCard";
import { Box, Button, Divider } from "@mui/material";
import { formatDate } from "../utils/functions";
import Grid from "@mui/material/Grid2";


interface DetailsProps {
  content: string | undefined;
  status: string;
  projectTitle: string | undefined;
  projectWebsite: string;
  studyTitle: string;
  version: string;
  issuanceDate: string;
  statusDatetime: string;
  experimentTypes: string;
  typeOfSamplesCollected: string;
  numberOfSamplesCollected: string;
  diseasesInSamples: string;
  issuer: string;
  dataManager: string;
  email: string;
  affiliation: string;
}
export default function ServiceOfferingDetailsData(props: DetailsProps) {
  const {
    content,
    status,
    projectTitle,
    projectWebsite,
    studyTitle,
    version,
    issuanceDate,
    statusDatetime,
    experimentTypes,
    typeOfSamplesCollected,
    numberOfSamplesCollected,
    diseasesInSamples,
    issuer,
    dataManager,
    email,
    affiliation,
  } = props;
  const projectList = [
    {
      key: "Project title",
      value: projectTitle || "-",
    },
    { key: "Project website", value: projectWebsite || "-" },
  ];

  const studiesList = [
    {
      key: "Study title",
      value: studyTitle || "-",
    },
  ];

  const generalDatasetInfoList = [
    { key: "Version", value: version || "-" },
    { key: "Date of creation of the dataset", value: formatDate(issuanceDate) },
    {
      key: "Date of the last update of the dataset",
      value: formatDate(statusDatetime),
    },
    { key: "Experiment types", value: experimentTypes || "-" },
    { key: "Type of Samples Collected", value: typeOfSamplesCollected || "-" },
    {
      key: "Number of Samples Collected",
      value: numberOfSamplesCollected || "-",
    },
    { key: "Diseases in samples", value: diseasesInSamples || "-" },
  ];

  const DatasetContactsList = [
    { key: "Data owner", value: issuer || "-" },
    { key: "Data manager", value: dataManager || "-" },
    { key: "email", value: email || "-" },
    { key: "affiliation", value: affiliation || "-" },
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
        <Box>
          <Grid
            container
            spacing={2}
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Grid sx={{ mb: 6 }}>
              <Typography variant="h6" fontWeight="bold">
                {content}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                fontWeight="bold"
              >
                Data provider: {issuer}
              </Typography>
            </Grid>
              <span
                  style={{
                    // backgroundColor: vatStatus === "valid" ? "green" : "red",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {status === "active" ? "✅" : "❌"}
                </span>
          </Grid>
          <Grid
            container
            spacing={2}
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Grid>
              <Typography variant="body1" color="text.secondary">
                Creation date: {formatDate(issuanceDate)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button variant="contained" color="primary">
            Request access to the dataset
          </Button>
          <Button variant="contained" color="secondary">
            Download metadata
          </Button>
        </Box>
      </Box>

      {/* Accordion Section */}
      {[
        { title: "Project", data: projectList },
        { title: "Studies", data: studiesList },
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
              <Typography>Download document</Typography>
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
