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
  vp: string,
  id: string;
  name: string;
  address: string;
  lrnType: string | undefined;
  lrnCode: string;
  complianceStatus: string;
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

  const apiService = useMemo(() => new ApiService(() => router.push("/")), [router]);
  async function fetchData() {
    try {
      const response = await apiService.getParticipants(); // Call the instance method
      if (response?.data?.items) {
        const formattedData = response.data.items.map((item) => {
          const description = JSON.parse(item.selfDescription || "");

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const participant = description.verifiableCredential.find((vc: any) =>
            vc.type.indexOf("gx:LegalParticipant") !== -1);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const lrn = description.verifiableCredential.find((vc: any) =>
            vc.credentialSubject.type == "gx:legalRegistrationNumber");

          // Normalize attribute names
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const normalize = (obj: any, keys: string[]) => {
            const foundKey = keys.find((key) => obj[key]);
            return foundKey ? obj[foundKey] : "-";
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any     
          const normalizeKey = (obj: any, keys: string[]) => {
            const foundKey = keys.find((key) => obj[key]);
            return foundKey?.split("gx:")[1]
              .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camel case words
              .replace(/(^\w| \w)/g, match => match.toUpperCase()) // Capitalize the first letter of each word
          };
          return {
            vp: JSON.stringify(item),
            id: item?.id || "",
            name: normalize(participant.credentialSubject, ["gx:legalName"]),
            address: normalize(
              participant.credentialSubject["gx:legalAddress"],
              ["gx:countrySubdivisionCode"]
            ),
            lrnCode: normalize(lrn.credentialSubject, [
              "gx:leiCode",
              "gx:vatID",
              "gx:EORI",
              "gx:taxID",
              "gx:EUID"
            ]),
            lrnType: normalizeKey(lrn.credentialSubject, [
              "gx:leiCode",
              "gx:vatID",
              "gx:EORI",
              "gx:taxID",
              "gx:EUID"
            ]),
            description: normalize(participant.credentialSubject, [
              "gx:description",
            ]),
            headquartersAddress: normalize(participant.credentialSubject, [
              "gx:headquarterAddress",
              "gx:headquartersAddress",
            ])["gx:countrySubdivisionCode"],
            legalAddress: normalize(
              participant.credentialSubject["gx:legalAddress"],
              ["gx:countrySubdivisionCode"]
            ),
            parentOrganization: normalize(participant.credentialSubject, [
              "gx:parentOrganization",
              "gx:parentOrganizationOf",
            ]),
            subOrganization: normalize(participant.credentialSubject, [
              "gx:subOrganization",
              "gx:subOrganizationOf",
            ]),
            complianceStatus: "",
          };
        });
        //console.log("formattedData", formattedData);
        setParticipantsList(formattedData);
        verifyVatNumbers(formattedData);
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
        participant.lrnCode.toLowerCase().includes(lowerCaseQuery) ||
        participant.description.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilteredParticipants(filtered);
  };

  // Function to verify VAT numbers
  const verifyVatNumbers = async (participants: ParticipantsList[]) => {
    const updatedParticipants = await Promise.all(
      participants.map(async (participant) => {
        if (!participant.lrnCode) return participant;
        
        try {
          //const response = await axios.get(participant.lrnCode);
          let status = "invalid";
          // TODO: Redesign the interface to asynchronously request the compliance for every item
          // if (process.env.NEXT_PUBLIC_GAIAX_COMPLIANCE_URL) {
          //   const response = await axios.post(process.env.NEXT_PUBLIC_GAIAX_COMPLIANCE_URL, participant.vp);
          //   status = response.status == 201 ? "valid" : "invalid";
          // }
          return {
            ...participant,
            //complianceStatus: response.data ? "valid" : "invalid",
            complianceStatus: status,
          };
        } catch {
          return { ...participant, complianceStatus: "invalid" };
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
                    lrnCode={participant.lrnCode}
                    complianceStatus={participant.complianceStatus}
                    address={participant.address}
                    lrnType={participant.lrnType}
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
                    lrnCode={selectedCard.lrnCode}
                    complianceStatus={selectedCard.complianceStatus}
                    description={selectedCard.description}
                    headquartersAddress={selectedCard.headquartersAddress}
                    legalAddress={selectedCard.legalAddress}
                    parentOrganization={selectedCard.parentOrganization}
                    subOrganization={selectedCard.parentOrganization}
                    lrnType={selectedCard.lrnType}
                  />
                </Paper>
              </DetailsPane>
            </Grid>
          )}
        </Grid>
      )}
      <OnboardParticipant open={openModal} setOpen={setOpenModal} refreshParticipants={fetchData} />
    </div>
  );
};

export default ProtectedRoute(Participant);
