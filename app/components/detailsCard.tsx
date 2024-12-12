import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueCard from "./keyValueCard";
import LeftCard from "./leftCard";

export default function DetailsData() {
  const addressList = [
    { key: "Street & House Number", value: "89D Parc d'Activités Capellen" },
    { key: "Postal code", value: "L-8308" },
    { key: "City", value: "Capellen" },
    { key: "Country", value: "Luxembourg" },
  ];

  const participantContactPointList = [
    { key: "Legal representative", value: "Quentin Virriat" },
    { key: "Email", value: "Qvirriat@ntt.lu" },
    { key: "Phone number", value: "-" },
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
          <Typography>Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Address</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <KeyValueCard keyValueList={addressList} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Participant contact point</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <KeyValueCard keyValueList={participantContactPointList} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
