import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueCard from "./keyValueCard";
import { Avatar, Box, Divider } from "@mui/material";

export default function ServiceOfferingDetailsData() {
  const projectList = [
    {
      key: "Project title",
      value:
        "A global trascriptome analyses of keratinocytes upon suppression of endogenous",
    },
    { key: "Project website", value: "https://www.google.com/" },
  ];

  const studiesList = [
    {
      key: "Study title",
      value: "A global transcriptome analysis of keratinocytes upon",
    },
  ];

  const generalDatasetInfoList = [
    { key: "Version", value: "-" },
    { key: "Date of creation of the dataset", value: "2024-10-29" },
    {
      key: "Date of creation of the last update of the dataset",
      value: "2024-10-29",
    },
    { key: "Experiment types", value: "expression profiling by array" },
    { key: "Type of Samples Collected", value: "-" },
    { key: "Number of Samples Collected", value: "6" },
    { key: "Diseases in samples", value: "psoriasis" },
  ];

  const DatasetContactsList = [
    { key: "Data owner", value: "Person A" },
    { key: "Data manager", value: "Manager A" },
    { key: "email", value: "email@gmail.com" },
    { key: "affiliation", value: "-" },
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
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          alt="NTT Logo"
          src="sds" // Replace with the actual logo URL
          sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
        >
          NTT
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            NTT LUXEMBOURG PSF S.A
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Luxembourg - Capellen
          </Typography>
          <Typography variant="body2" color="text.secondary">
            VAT Number: LU20769255
          </Typography>
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
        Last updated: 2024-12-01
      </Typography>
    </Box>
  );
}
