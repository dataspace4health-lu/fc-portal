import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueCard from "./keyValueCard";
import { Avatar, Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import participants from "./participants.json";
import { useRouter } from "next/navigation";

interface detailsProps {
  name: string;
  id: string;
  logoUrl?: string; // Optional logo URL
  address: string;
  vatNumber: string;
  description: string;
  legalAddress: string;
  headquartersAddress: string;
  parentOrganization: string;
  subOrganization: string;
  vatStatus: string;
  lrnType:string | undefined;
}

export default function DetailsData(detailsProps: detailsProps) {
  const {
    id,
    name,
    vatNumber,
    address,
    description,
    legalAddress,
    headquartersAddress,
    parentOrganization,
    subOrganization,
    vatStatus,
    lrnType,
  } = detailsProps;
  const router = useRouter();
  const addressList = [
    { key: "Legal Address", value: legalAddress },
    { key: "Headquarters Address", value: headquartersAddress },
  ];

  const participantOrganizationList = [
    { key: "Parent organization", value: parentOrganization },
    { key: "Sub organization", value: subOrganization },
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
                {name}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                fontWeight="bold"
              >
                DS4H ID: {id}
              </Typography>
            </Grid>
            <Avatar
              alt={name}
              sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
            >
              {participants.find((ele) => ele.name === name)?.abbreviation}
            </Avatar>
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
                Address: {address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              {lrnType} : {vatNumber}
                <span
                  style={{
                    // backgroundColor: vatStatus === "valid" ? "green" : "red",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {vatStatus === "valid" ? "✅" : "❌"}
                </span>
              </Typography>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                onClick={() => {
                  router.push("serviceOffering");
                }}
              >
                {"Go to participant's datasets"}
              </Button>
            </Grid>
          </Grid>
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
          title: "Organization",
          content: <KeyValueCard keyValueList={participantOrganizationList} />,
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
