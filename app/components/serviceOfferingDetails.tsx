import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueCard from "./keyValueCard";
import LeftCard from "./leftCard";

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
    { key: "email", value: "email@gmail.com"},
    { key: "affiliation", value: "-"},
  ];

  return (
    <div>
      <LeftCard
        id="1"
        name="NTT LUXEMBOURG PSF S.A"
        logoUrl="sds"
        address="Luxembourg - Capellen"
        vatNumber="LU20769255"
      />
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Project</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <KeyValueCard keyValueList={projectList} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Studies</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <KeyValueCard keyValueList={studiesList} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>General Dataset Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <KeyValueCard keyValueList={generalDatasetInfoList} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Dataset contacts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <KeyValueCard keyValueList={DatasetContactsList} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Data Sharing agreement (DSA)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Download document</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
