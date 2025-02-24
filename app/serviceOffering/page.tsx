"use client";
import * as React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import MenuAppBar from "../components/appBar";
import CustomSeparator from "../components/pathSeperation";
import ServiceOfferingDetailsData from "../components/serviceOfferingDetails";
import { useEffect, useMemo, useState } from "react";
import SelectInput from "../components/selectInput";
import SearchBar from "../components/searchComponent";
import ProtectedRoute from "../components/protectedRoute";
import ApiService from "../apiService/apiService";
import { useRouter } from "next/navigation";
import { ApiError } from "next/dist/server/api-utils";
import SdLeftCard from "../components/sdLeftCard";
import OnboardParticipant from "../components/onboardDialog";
interface Meta {
  id: string;
  expirationTime: string | undefined;
  issuer: string;
  sdHash: string;
  status: string;
  statusDatetime: string;
  uploadDatetime: string;
  validatorDids: string;
  validators: string;
  content: string | undefined;
}
interface SelfDescription {
  content?: string | undefined;
  meta: Meta;
}

const Sidebar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  height: "100vh",
  overflowY: "auto",
}));

const DetailsPane = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100vh",
  overflowY: "auto",
  backgroundColor: theme.palette.background.default,
}));

const options = [
  { label: "content", id: "content" },
  { label: "date", id: "date" },
  { label: "issuer", id: "issuer" },
  { label: "status", id: "status" },
];

const CardContainer = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  marginBottom: theme.spacing(2),
  cursor: "pointer",
  padding: theme.spacing(2),
  border: isSelected
    ? `2px solid ${theme.palette.primary.main}`
    : "1px solid transparent",
  borderRadius: theme.shape.borderRadius,
  boxShadow: isSelected ? theme.shadows[4] : theme.shadows[1],
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "scale(1.02)",
  },
}));

const ServiceOffering = () => {
  const [selectedOption, setSelectedOption] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [selfDescriptionsList, setSelfDescriptionsList] = useState<
    SelfDescription[]
  >([]);
  const [selectedCard, setSelectedCard] = useState<SelfDescription>();
  const [filteredSelfDescriptions, setFilteredSelfDescriptions] =
    useState<SelfDescription[]>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const router = useRouter();

  const selfDescriptionApiService = useMemo(
    () => new ApiService(() => router.push("/")),
    []
  );

  async function fetchData() {
    try {
      const response = await selfDescriptionApiService.getServiceOfferings();
      if (response?.data?.items) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sd: any = response?.data?.items;
        setSelfDescriptionsList(sd);
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error(apiError.message || "An error occurred");
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selfDescriptionsList) {
      setFilteredSelfDescriptions(selfDescriptionsList); // Initialize with the full list
    }
  }, [selfDescriptionsList]);

  console.log("selfDescriptionsList", selfDescriptionsList);

  const handleValueChange = (value: { id: string; label: string } | null) => {
    setSelectedOption(value);
    if (value && selfDescriptionsList) {
      const sortedList = [...selfDescriptionsList].sort((a, b) => {
        const key = value.id as keyof SelfDescription;
        if (typeof a[key] === "string" && typeof b[key] === "string") {
          return (a[key] as string).localeCompare(b[key] as string);
        }
        return 0;
      });
      setSelfDescriptionsList(sortedList);
    }
  };

  const handleCardClick = async (card: SelfDescription) => {
    setSelectedCard(card);
    console.log("card", card);
    const response = await selfDescriptionApiService.getServiceOfferingDetails(
      card.meta.sdHash
    );
    console.log("response", response);
    if (response) {
      // setSelfDescriptionsData(response);
    }
  };

  const handleSearch = (query: string | null) => {
    if (!query) {
      setFilteredSelfDescriptions(selfDescriptionsList || []); // Reset to the full list
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = (selfDescriptionsList || []).filter((sd) => {
      console.log("sd", sd);
      return (
        sd.meta.issuer.toLowerCase().includes(lowerCaseQuery) ||
        sd.meta.status.toLowerCase().includes(lowerCaseQuery) ||
        sd.meta.statusDatetime.toLowerCase().includes(lowerCaseQuery) ||
        sd.meta.uploadDatetime.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilteredSelfDescriptions(filtered);
  };

  const openOnboardingDialog = () => {
    setOpenModal(true);
  };

  return (
    <div>
      <MenuAppBar />
      <Box sx={{ py: 1 }}>
        <CustomSeparator />
        <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
          <Grid size={{ xs: 4, md: 12 }} sx={{ m: 2 }}>
            <Button variant="contained" onClick={openOnboardingDialog}>
              Onboard new Data Offer
            </Button>
          </Grid>
          <Grid size={{ xs: 4 }} sx={{ textAlign: "right" }}>
            <SelectInput
              options={options}
              fieldLabel="Sorted by"
              onValueChange={handleValueChange}
              value={selectedOption}
            />
          </Grid>
          <Grid size={{ xs: 8 }}>
            <SearchBar handleSearch={handleSearch} />
          </Grid>
        </Grid>
      </Box>

      <Grid container sx={{ height: "100vh" }}>
        {/* Left Pane: Vertical Cards */}
        <Grid size={{ xs: 4 }}>
          <Sidebar>
            {filteredSelfDescriptions?.map((sd) => (
              <CardContainer
                key={sd.meta.sdHash}
                isSelected={sd.meta.sdHash === selectedCard?.meta?.sdHash}
                onClick={() => handleCardClick(sd)}
              >
                <SdLeftCard
                  content={sd.content}
                  issuer={sd.meta.issuer}
                  status={sd.meta.status}
                  statusDatetime={sd.meta.statusDatetime}
                  uploadDatetime={sd.meta.uploadDatetime}
                />
              </CardContainer>
            ))}
          </Sidebar>
        </Grid>

        {/* Right Pane: Card Details */}
        {selectedCard && (
          <Grid size={{ xs: 8 }}>
            <DetailsPane>
              <Typography variant="h4" gutterBottom>
                {selectedCard.content}
              </Typography>
              <Paper elevation={3}>
                <ServiceOfferingDetailsData
                  content={selectedCard.content}
                  status={selectedCard.meta.status}
                  projectTitle={selectedCard.content}
                  issuer={selectedCard.meta.issuer}
                  projectWebsite={""}
                  studyTitle={""}
                  version={""}
                  issuanceDate={selectedCard.meta.uploadDatetime}
                  statusDatetime={selectedCard.meta.statusDatetime}
                  experimentTypes={""}
                  typeOfSamplesCollected={""}
                  numberOfSamplesCollected={""}
                  diseasesInSamples={""}
                  dataManager={""}
                  email={""}
                  affiliation={""}
                  // Add other required props here
                />
              </Paper>
            </DetailsPane>
          </Grid>
        )}
      </Grid>
      <OnboardParticipant
        open={openModal}
        setOpen={setOpenModal}
        refreshList={fetchData}
        dialogTitle="Onboard New Data offer"
      />
    </div>
  );
};

export default ProtectedRoute(ServiceOffering);
