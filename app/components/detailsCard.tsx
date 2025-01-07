import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueCard from "./keyValueCard";
import { Avatar, Box } from "@mui/material";

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
    <Box
      sx={{
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
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

      {/* Accordion Components */}
      {[
        { title: "Description", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget." },
        { title: "Address", content: <KeyValueCard keyValueList={addressList} /> },
        { title: "Participant contact point", content: <KeyValueCard keyValueList={participantContactPointList} /> },
      ].map((section, index) => (
        <Accordion
          key={index}
          defaultExpanded
          sx={{
            mb: 2,
            borderRadius: 2,
            "&:before": { display: "none" }, // Removes default divider
            "&.Mui-expanded": { margin: 0 },
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            sx={{
              bgcolor: "grey.100",
              "&:hover": { bgcolor: "grey.200" },
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {section.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: "grey.50" }}>
            {typeof section.content === "string" ? (
              <Typography variant="body1">{section.content}</Typography>
            ) : (
              section.content
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
