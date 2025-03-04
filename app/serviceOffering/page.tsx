/* eslint-disable @typescript-eslint/no-explicit-any */
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
  content: string;
  meta: Meta;
  sdName: string;
  sdDescription: string;
  dataProtectionRegime: string;
  policy: string;
  accessType: string;
  formatType: string;
  requestType: string;
  termsAndConditionsUrl: string;
  issuerName: string;
  issuerDescription: string;
  issuerLegalAddress: string;
  issuerHeadquarterAddress: string;
  complianceCheck: boolean;
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
      const response =
        await selfDescriptionApiService.getServiceOfferings(true);
      if (response?.data?.items) {
        const selfDescriptions: any = response?.data?.items;
        const serviceOfferingVp = selfDescriptions.filter((ele: any) => {
          const content = JSON.parse(ele.content || "");
          const serviceOfferingVc = content.verifiableCredential.find(
            (c: any) => c.type.indexOf("gx:ServiceOffering") !== -1
          );
          return serviceOfferingVc;
        });
        const modifiedSd = await Promise.all(
          serviceOfferingVp.map(async (sd: any) => {
            const content = JSON.parse(sd.content || "");
            const serviceOfferingVc = content.verifiableCredential.find(
              (c: any) => c.type.indexOf("gx:ServiceOffering") !== -1
            )?.credentialSubject;
            const sdName = serviceOfferingVc ? serviceOfferingVc["gx:name"] : "";
            const sdDescription = serviceOfferingVc
              ? serviceOfferingVc["gx:description"]
              : "";
            const dataProtectionRegime = serviceOfferingVc
              ? serviceOfferingVc["gx:dataProtectionRegime"]
              : "";
            const policy = serviceOfferingVc ? serviceOfferingVc["gx:policy"] : "";
            const accessType = serviceOfferingVc
              ? serviceOfferingVc["gx:dataAccountExport"]["gx:accessType"]
              : "";
            const formatType = serviceOfferingVc
              ? serviceOfferingVc["gx:dataAccountExport"]["gx:formatType"]
              : "";
            const requestType = serviceOfferingVc
              ? serviceOfferingVc["gx:dataAccountExport"]["gx:requestType"]
              : "";
            const termsAndConditionsUrl = serviceOfferingVc
              ? serviceOfferingVc["gx:termsAndConditions"]["gx:URL"]
              : "";
        
            const legalParticipantVc = content.verifiableCredential.find(
              (c: any) => c.type.indexOf("gx:LegalParticipant") !== -1
            );
        
            console.log("legalParticipantVc", legalParticipantVc);
            const issuerName = legalParticipantVc?.credentialSubject["gx:legalName"];
            const issuerDescription =
              legalParticipantVc?.credentialSubject["gx:description"];
            const issuerHeadquarterAddress =
              legalParticipantVc?.credentialSubject["gx:headquarterAddress"][
                "gx:countrySubdivisionCode"
              ];
            const issuerLegalAddress =
              legalParticipantVc?.credentialSubject["gx:legalAddress"][
                "gx:countrySubdivisionCode"
              ];
        
            
            const complianceCheck = (await selfDescriptionApiService.checkServiceOfferingCompliance(content));
        
            return {
              ...sd,
              sdName,
              sdDescription,
              content,
              dataProtectionRegime,
              policy,
              accessType,
              formatType,
              requestType,
              termsAndConditionsUrl,
              issuerName,
              issuerDescription,
              issuerHeadquarterAddress,
              issuerLegalAddress,
              complianceCheck,
            };
          })
        );
        
        setSelfDescriptionsList(modifiedSd);
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
  };

  const handleSearch = (query: string | null) => {
    setSelectedCard(undefined);
    if (!query) {
      setFilteredSelfDescriptions(selfDescriptionsList || []); // Reset to the full list
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = (selfDescriptionsList || []).filter((sd) => {
      return (
        sd.meta.issuer.toLowerCase().includes(lowerCaseQuery) ||
        sd.meta.status.toLowerCase().includes(lowerCaseQuery) ||
        sd.meta.statusDatetime.toLowerCase().includes(lowerCaseQuery) ||
        sd.meta.uploadDatetime.toLowerCase().includes(lowerCaseQuery) ||
        sd?.sdName?.toLowerCase().includes(lowerCaseQuery) ||
        sd?.sdDescription?.toLowerCase().includes(lowerCaseQuery) ||
        sd?.dataProtectionRegime?.toLowerCase().includes(lowerCaseQuery) ||
        sd?.policy?.toLowerCase().includes(lowerCaseQuery) ||
        sd?.accessType?.toLowerCase().includes(lowerCaseQuery) ||
        sd?.formatType?.toLowerCase().includes(lowerCaseQuery) ||
        sd?.requestType?.toLowerCase().includes(lowerCaseQuery)
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
        {filteredSelfDescriptions?.length === 0 && (
          <Typography variant="h6" sx={{ m: 2 }}>
            No results found
          </Typography>
        )}
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
                  sdName={sd.sdName}
                  issuer={sd.meta.issuer}
                  status={sd.meta.status}
                  statusDatetime={sd.meta.statusDatetime}
                  uploadDatetime={sd.meta.uploadDatetime}
                  issuerName={sd.issuerName}
                  complianceCheck={sd.complianceCheck}
                />
              </CardContainer>
            ))}
          </Sidebar>
        </Grid>

        {/* Right Pane: Card Details */}
        {selectedCard && (
          <Grid size={{ xs: 8 }}>
            <DetailsPane>
              <Paper elevation={3}>
                <ServiceOfferingDetailsData
                  sdName={selectedCard.sdName}
                  sdDescription={selectedCard.sdDescription}
                  status={selectedCard.meta.status}
                  dataProtectionRegime={selectedCard.dataProtectionRegime}
                  policy={selectedCard.policy}
                  accessType={selectedCard.accessType}
                  formatType={selectedCard.formatType}
                  requestType={selectedCard.requestType}
                  issuer={selectedCard.meta.issuer}
                  issuanceDate={selectedCard.meta.uploadDatetime}
                  statusDatetime={selectedCard.meta.statusDatetime}
                  termsAndConditionsUrl={selectedCard.termsAndConditionsUrl}
                  issuerName={selectedCard.issuerName}
                  issuerDescription={selectedCard.issuerDescription}
                  issuerLegalAddress={selectedCard.issuerLegalAddress}
                  issuerHeadquarterAddress={
                    selectedCard.issuerHeadquarterAddress
                  }
                  selfDescriptionHash={selectedCard.meta.sdHash}
                  refreshList={fetchData}
                  complianceCheck={selectedCard.complianceCheck}
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
