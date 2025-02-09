"use client";
import { Box, Typography, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import LeftCard from "../components/leftCard";
import MenuAppBar from "../components/appBar";
import SearchBar from "../components/searchComponent";
import SelectInput from "../components/selectInput";
import CustomSeparator from "../components/pathSeperation";
import DetailsData from "../components/detailsCard";
import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../components/protectedRoute";
import { useRouter } from "next/navigation";
import ApiService from "../apiService/apiService";
import axios from "axios";
import OnboardParticipant from "../components/onboardParticipantDialog";

interface ParticipantsList {
  id: string;
  name: string;
  address: string;
  vatNumber: string;
  vatStatus: string;
  description: string;
  headquartersAddress: string;
  legalAddress: string;
  parentOrganization: string;
  subOrganization: string;
}

interface ApiError extends Error {
  response?: {
    status: number;
  };
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

const options = [
  { id: "name", label: "name" },
  { id: "id", label: "id" },
  { id: "address", label: "address" },
  { id: "Vat number", label: "Vat number" },
];

const Participant = () => {
  const [selectedCard, setSelectedCard] = useState<ParticipantsList>();
  const [participantsList, setParticipantsList] =
    useState<ParticipantsList[]>();
  const [selectedOption, setSelectedOption] = useState<{
    id: string;
    label: string;
  } | null>(options[0]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    ParticipantsList[]
  >([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const router = useRouter();

  const handleCardClick = (card: ParticipantsList) => {
    setSelectedCard(card);
  };

  const apiService = useMemo(() => new ApiService(() => router.push("/")), []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiService.getParticipants(); // Call the instance method
        if (response?.data?.items) {
          const formattedData = response.data.items.map((item) => {
            const description = JSON.parse(item.selfDescription || "");
            const credential = description.verifiableCredential[0];
            // Normalize attribute names
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const normalize = (obj: any, keys: string[]) => {
              const foundKey = keys.find((key) => obj[key]);
              return foundKey ? obj[foundKey] : "-";
            };

            return {
              id: item?.id?.split("/")[1] || "",
              name: normalize(credential.credentialSubject, ["gx:legalName"]),
              address: normalize(
                credential.credentialSubject["gx:legalAddress"],
                ["gx:countrySubdivisionCode"]
              )["gx:countrySubdivisionCode"],
              vatNumber: normalize(credential.credentialSubject, [
                "gx:legalRegistrationNumber",
                "gx:registrationNumber",
              ]).id,
              description: normalize(credential.credentialSubject, [
                "gx:description",
              ]),
              headquartersAddress: normalize(credential.credentialSubject, [
                "gx:headquarterAddress",
                "gx:headquartersAddress",
              ])["gx:countrySubdivisionCode"],
              legalAddress: normalize(
                credential.credentialSubject["gx:legalAddress"],
                ["gx:countrySubdivisionCode"]
              ),
              parentOrganization: normalize(credential.credentialSubject, [
                "gx:parentOrganization",
                "gx:parentOrganizationOf",
              ]),
              subOrganization: normalize(credential.credentialSubject, [
                "gx:subOrganization",
                "gx:subOrganizationOf",
              ]),
              vatStatus: "",
            };
          });
          console.log("formattedData", formattedData);
          setParticipantsList(formattedData);
          verifyVatNumbers(formattedData);
        }
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error(apiError.message || "An error occurred");
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (participantsList) {
      setFilteredParticipants(participantsList); // Initialize with the full list
    }
  }, [participantsList]);

  const handleValueChange = (value: { id: string; label: string } | null) => {
    setSelectedOption(value);
    if (value && participantsList) {
      const sortedList = [...participantsList].sort((a, b) => {
        const key = value.id as keyof ParticipantsList;
        if (typeof a[key] === "string" && typeof b[key] === "string") {
          return (a[key] as string).localeCompare(b[key] as string);
        }
        return 0;
      });
      setParticipantsList(sortedList);
    }
  };

  const handleSearch = (query: string | null) => {
    if (!query) {
      setFilteredParticipants(participantsList || []); // Reset to the full list
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = (participantsList || []).filter((participant) => {
      return (
        participant.name.toLowerCase().includes(lowerCaseQuery) ||
        participant.address.toLowerCase().includes(lowerCaseQuery) ||
        participant.vatNumber.toLowerCase().includes(lowerCaseQuery) ||
        participant.description.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilteredParticipants(filtered);
  };

  // Function to verify VAT numbers
  const verifyVatNumbers = async (participants: ParticipantsList[]) => {
    const updatedParticipants = await Promise.all(
      participants.map(async (participant) => {
        if (!participant.vatNumber) return participant;

        try {
          const response = await axios.get(participant.vatNumber);
          return {
            ...participant,
            vatStatus: response.data ? "valid" : "invalid",
          };
        } catch {
          return { ...participant, vatStatus: "invalid" };
        }
      })
    );

    setParticipantsList(updatedParticipants);
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
              Onboard new Participant
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
      {filteredParticipants && filteredParticipants.length > 0 && (
        <Grid container sx={{ height: "100vh" }}>
          {/* Left Pane: Vertical Cards */}
          <Grid size={{ xs: 4 }}>
            <Sidebar>
              {filteredParticipants.map((participant) => (
                <CardContainer
                  key={participant.id}
                  isSelected={participant.id === selectedCard?.id}
                  onClick={() => handleCardClick(participant)}
                >
                  <LeftCard
                    id={participant.id}
                    name={participant.name}
                    vatNumber={participant.vatNumber}
                    vatStatus={participant.vatStatus}
                    address={participant.address}
                    // logoUrl={participant.logo}
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
                  {selectedCard.name}
                </Typography>
                <Paper elevation={3}>
                  <DetailsData
                    id={selectedCard.id}
                    name={selectedCard.name}
                    address={selectedCard.address}
                    vatNumber={selectedCard.vatNumber}
                    vatStatus={selectedCard.vatStatus}
                    description={selectedCard.description}
                    headquartersAddress={selectedCard.headquartersAddress}
                    legalAddress={selectedCard.legalAddress}
                    parentOrganization={selectedCard.parentOrganization}
                    subOrganization={selectedCard.parentOrganization}
                  />
                </Paper>
              </DetailsPane>
            </Grid>
          )}
        </Grid>
      )}
      <OnboardParticipant open={openModal} setOpen={setOpenModal} />
    </div>
  );
};

export default ProtectedRoute(Participant);
