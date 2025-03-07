import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueCard from "./keyValueCard";
import { Box, Button, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import { complianceResponse } from "../utils/interfaces";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import { useMemo, useState } from "react";
import SimpleDialog from "./simpleDialog";
import SnackbarComponent from "./snackbar";
import ApiService from "../apiService/apiService";
interface detailsProps {
  name: string;
  id: string;
  logoUrl?: string; // Optional logo URL
  address: string;
  lrnType: string | undefined;
  lrnCode: string;
  complianceCheck: complianceResponse;
  description: string;
  legalAddress: string;
  headquartersAddress: string;
  parentOrganization: string;
  subOrganization: string;
  refreshList: () => void;
  setSelectedCard: (val: undefined) => void;
}

export default function DetailsData(detailsProps: detailsProps) {
  const {
    id,
    name,
    lrnCode,
    address,
    description,
    legalAddress,
    headquartersAddress,
    parentOrganization,
    subOrganization,
    complianceCheck,
    lrnType,
    refreshList,
    setSelectedCard,
  } = detailsProps;
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");
  const [loading, setLoading] = useState(false);

  const addressList = [
    { key: "Legal Address", value: legalAddress },
    { key: "Headquarters Address", value: headquartersAddress },
  ];

  const participantOrganizationList = [
    { key: "Parent organization", value: parentOrganization },
    { key: "Sub organization", value: subOrganization },
  ];

  const participantApiService = useMemo(
    () => new ApiService(() => router.push("/")),
    []
  );

  const handleApiResponse = (
    message: string,
    severity: "success" | "error"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await participantApiService.deleteParticipant(id);
      handleApiResponse("Data offer deleted successfully!", "success");
    } catch (error) {
      handleApiResponse(
        `Failed to create Data offer. Please try again.`,
        "error"
      );
      console.error("error", error);
    }
    refreshList();
    setOpenDeleteDialog(false);
    setLoading(false);
    setSelectedCard(undefined);
  };

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="error"
          sx={{ mb: 4 }}
          onClick={() => setOpenDeleteDialog(true)}
        >
          Delete
        </Button>
      </Box>
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
            <Tooltip title={complianceCheck.message} arrow>
              {complianceCheck.success ? (
                <VerifiedUserIcon sx={{ color: "green" }} />
              ) : (
                <GppMaybeIcon sx={{ color: "red" }} />
              )}
            </Tooltip>
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
                {lrnType} : {lrnCode}
                {/* <span
                  style={{
                    // backgroundColor: complianceStatus === "valid" ? "green" : "red",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {complianceCheck.success ? "✅" : "❌"}
                </span> */}
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
      <SimpleDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        title={"Delete Participant"}
        description={
          "Are you sure you want to delete this participant? This action cannot be undone."
        }
        handleConfirmDelete={handleConfirmDelete}
        loading={loading}
      />
      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
}
