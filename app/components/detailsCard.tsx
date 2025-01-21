import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueCard from "./keyValueCard";
import { Avatar, Box } from "@mui/material";
import participants from "./participants.json";

interface detailsProps {
  name: string;
  id: string;
  logoUrl?: string; // Optional logo URL
  address: string;
  vatNumber: string;
  description: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  legalRepresentativeName: string;
  legalRepresentativeEmail: string;
  legalRepresentativePhoneNumber: string;
}

export default function DetailsData(detailsProps: detailsProps) {
  const {
    id,
    name,
    vatNumber,
    address,
    description,
    street,
    houseNumber,
    postalCode,
    city,
    country,
    legalRepresentativeName,
    legalRepresentativeEmail,
    legalRepresentativePhoneNumber,
  } = detailsProps;
  const addressList = [
    { key: "Street & House Number", value: `${houseNumber}, ${street}` },
    { key: "Postal code", value: postalCode },
    { key: "City", value: city },
    { key: "Country", value: country },
  ];

  const participantContactPointList = [
    { key: "Legal representative", value: legalRepresentativeName },
    { key: "Email", value: legalRepresentativeEmail },
    { key: "Phone number", value: legalRepresentativePhoneNumber },
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
          alt={name}
          sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
        >
          {participants.find((ele) => ele.name === name)?.abbreviation}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ID: {id}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Address: {address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            VAT Number: {vatNumber}
          </Typography>
        </Box>
      </Box>

      {/* Accordion Components */}
      {[
        {
          title: "Description",
          content: description,
        },
        {
          title: "Address",
          content: <KeyValueCard keyValueList={addressList} />,
        },
        {
          title: "Participant contact point",
          content: <KeyValueCard keyValueList={participantContactPointList} />,
        },
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
