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
import OnboardDialog from "../components/onboardDialog";
import { complianceResponse } from "../utils/interfaces";
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
export interface SelfDescription {
  content: string;
  meta: Meta;
  sdName: string;
  sdDescription: string;
  dataProtectionRegime: string;
  policy: string;
  accessType: string;
  formatType: string;
  requestType: string;
  openApi: string;
  serviceAccessPointId: string;
  termsAndConditionsUrl: string;
  issuerName: string;
  issuerDescription: string;
  issuerLegalAddress: string;
  issuerHeadquarterAddress: string;
  complianceCheck: complianceResponse;
  labelLevelsVcs: any;
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
  { label: "Data Provider", id: "provider" },
  { label: "Creation Date", id: "date" },
  { label: "Status", id: "status" },
  { label: "Compliance", id: "compliance" },
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
        const modifiedSd = serviceOfferingVp.map((sd: any) => {
          const content = JSON.parse(sd.content || "");
          const serviceOfferingVcSubjects = content.verifiableCredential.find(
            (c: any) => c.type.indexOf("gx:ServiceOffering") !== -1
          )?.credentialSubject;
          const dataResource = serviceOfferingVcSubjects.find(
            (c: any) => c.type.indexOf("gx:DataResource") !== -1
          );
          const serviceOfferingSubject = serviceOfferingVcSubjects.find(
            (c: any) => c.type.indexOf("gx:ServiceOffering") !== -1
          );
          const serviceAccessPoint = serviceOfferingVcSubjects.find(
            (c: any) => c.type.indexOf("gx:ServiceAccessPoint") !== -1
          );
          const sdName = serviceOfferingSubject ? serviceOfferingSubject["gx:name"] : "";
          const sdDescription = serviceOfferingSubject
            ? serviceOfferingSubject["gx:description"]
            : "";
          const dataProtectionRegime = dataResource
            ? dataResource["gx:dataProtectionRegime"]
            : "";
          const policy = dataResource ? dataResource["gx:policy"] : "";
          const accessType = serviceOfferingSubject
            ? serviceOfferingSubject["gx:dataAccountExport"]["gx:accessType"]
            : "";
          const formatType = serviceOfferingSubject
            ? serviceOfferingSubject["gx:dataAccountExport"]["gx:formatType"]
            : "";
          const requestType = serviceOfferingSubject
            ? serviceOfferingSubject["gx:dataAccountExport"]["gx:requestType"]
            : "";
          const termsAndConditionsUrl = serviceOfferingSubject
            ? serviceOfferingSubject["gx:termsAndConditions"]["gx:URL"]
            : "";
          const openApi = serviceAccessPoint
            ? serviceAccessPoint["gx:openAPI"]
            : "";
          const serviceAccessPointId = serviceAccessPoint
            ? serviceAccessPoint.id
            : "";
          const legalParticipantVc = content.verifiableCredential.find(
            (c: any) => c.type.indexOf("gx:LegalParticipant") !== -1
          );
          const issuerName =
            legalParticipantVc?.credentialSubject["gx:legalName"];
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

          const labelLevelsVcs = serviceOfferingVcSubjects.find((vc: any) =>
            vc.type.startsWith("gx:ServiceOfferingLabelLevel")
          );

          // const complianceCheck = (await selfDescriptionApiService.checkServiceOfferingCompliance(content));

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
            openApi,
            serviceAccessPointId,
            termsAndConditionsUrl,
            issuerName,
            issuerDescription,
            issuerHeadquarterAddress,
            issuerLegalAddress,
            complianceCheck: null,
            labelLevelsVcs,
          };
        });
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

  useEffect(() => {
    if (selfDescriptionsList.length) {
      selfDescriptionsList.forEach((sd) => {
        selfDescriptionApiService
          .checkServiceOfferingCompliance(sd.content)
          .then((complianceCheck) => {
            setFilteredSelfDescriptions((prevList) =>
              (prevList ?? []).map((item) =>
                item === sd
                  ? {
                      ...item,
                      complianceCheck: complianceCheck as complianceResponse,
                    }
                  : item
              )
            );
          })
          .catch((error) => console.error("Compliance check failed", error));
      });
    }
  }, [selfDescriptionsList]); // Re-run when selfDescriptionsList changes

  const handleValueChange = (value: { id: string; label: string } | null) => {
    setSelectedOption(value);
    if (!value || !selfDescriptionsList) return;

    const key = value.id as keyof SelfDescription;

    const sortedList = [...selfDescriptionsList].sort((a, b) => {
      switch (key as "date" | "provider" | "status" | "compliance") {
        case "date":
          return (
            new Date(a.meta.statusDatetime).getTime() -
            new Date(b.meta.statusDatetime).getTime()
          );
        case "provider":
          return a.issuerName
            .toLocaleUpperCase()
            .localeCompare(b.issuerName.toLocaleUpperCase());
        case "status":
          return a.meta.status
            .toLocaleUpperCase()
            .localeCompare(b.meta.status.toLocaleUpperCase());
        // case "compliance":
        //   return (a.complianceCheck.success ?? "").localeCompare(b.complianceCheck.success ?? "");
        default:
          return 0; // Ensures a valid return type
      }
    });
    setSelfDescriptionsList(sortedList);
  };

  const handleCardClick = async (card: SelfDescription) => {
    setSelectedCard(card);
  };

  const handleSearch = (query: string | null) => {
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
        sd?.requestType?.toLowerCase().includes(lowerCaseQuery) ||
        sd?.issuerName?.toLowerCase().includes(lowerCaseQuery) ||
        sd?.issuerDescription?.toLowerCase().includes(lowerCaseQuery) ||
        sd?.issuerLegalAddress?.toLowerCase().includes(lowerCaseQuery) ||
        sd?.issuerHeadquarterAddress?.toLowerCase().includes(lowerCaseQuery)
      );
    });

    const foundSelectedSo = filtered.find(
      (ele) => ele.meta.id === selectedCard?.meta?.id
    );
    if (!foundSelectedSo) {
      setSelectedCard(undefined);
    }

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
              Publish new Data Offer
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
                  openApi={selectedCard.openApi}
                  serviceAccessPointId={selectedCard.serviceAccessPointId}
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
                  setSelectedCard={setSelectedCard}
                  complianceCheck={selectedCard.complianceCheck}
                  labelLevelsVcs={selectedCard.labelLevelsVcs}
                  content={selectedCard.content}
                />
              </Paper>
            </DetailsPane>
          </Grid>
        )}
      </Grid>
      <OnboardDialog
        open={openModal}
        setOpen={setOpenModal}
        refreshList={fetchData}
        dialogTitle="Publish New Data offer"
        selfDescriptionType="dataOffering"
      />
    </div>
  );
};

export default ProtectedRoute(ServiceOffering);
