/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueCard from "./keyValueCard";
import { Box, Button, Divider, Link } from "@mui/material";
import { formatDate, formatLabel } from "../utils/functions";
import LeftCard from "./sdLeftCard";
import SimpleDialog from "./simpleDialog";
import { useEffect, useMemo, useState } from "react";
import ApiService from "../apiService/apiService";
import { useRouter } from "next/navigation";
import SnackbarComponent from "./snackbar";
import CriteriaSection from "./criteriaSection";
import { SelfDescription } from "../serviceOffering/page";
import OnboardDialog from "./onboardDialog";
import { getUserInfo } from "./oidcIntegration";
import { complianceResponse } from "../utils/interfaces";

interface DetailsProps {
  sdName: string;
  sdDescription: string;
  dataProtectionRegime: string;
  policy: string;
  accessType: string;
  formatType: string;
  requestType: string;
  termsAndConditionsUrl: string;
  status: string;
  issuanceDate: string;
  statusDatetime: string;
  issuer: string;
  issuerName: string;
  issuerDescription: string;
  issuerLegalAddress: string;
  issuerHeadquarterAddress: string;
  selfDescriptionHash: string;
  refreshList: () => void;
  setSelectedCard: (val: SelfDescription | undefined) => void;
  complianceCheck: complianceResponse;
  labelLevelsVcs: any;
  content: any;
}
export default function ServiceOfferingDetailsData(props: DetailsProps) {
  const {
    sdName,
    sdDescription,
    status,
    accessType,
    formatType,
    requestType,
    // policy,
    issuanceDate,
    statusDatetime,
    issuer,
    termsAndConditionsUrl,
    issuerName,
    issuerDescription,
    issuerLegalAddress,
    issuerHeadquarterAddress,
    selfDescriptionHash,
    refreshList,
    setSelectedCard,
    complianceCheck,
    labelLevelsVcs,
    content,
  } = props;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");
  const [loading, setLoading] = useState(false);
  const [openUploadContractModal, setOpenUploadContractModal] = useState(false);
  const [isContractSignedSubmitted, setIsContractSignedSubmitted] =
    useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  const selfDescriptionApiService = useMemo(
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

  const generalDatasetInfoList = [
    { key: "Description", value: sdDescription || "-" },
    { key: "Date of creation of the dataset", value: formatDate(issuanceDate) },
    {
      key: "Date of the last update of the dataset",
      value: formatDate(statusDatetime),
    },
    { key: "Request Type", value: requestType || "-" },
    {
      key: "Access Type",
      value: accessType || "-",
    },
    { key: "Format Type", value: formatType || "-" },
    // { key: "Policy", value: policy || "-" },
  ];

  const datasetContactsList = [
    { key: "Data Owner", value: issuerName || issuer || "-" },
    { key: "Owner Description", value: issuerDescription || "-" },
    { key: "Legal Address", value: issuerLegalAddress || "-" },
    { key: "Headquarter Address", value: issuerHeadquarterAddress || "-" },
  ];

  const criteriaType = formatLabel(
    labelLevelsVcs?.credentialSubject?.type || ""
  );
  const criteria = labelLevelsVcs?.credentialSubject["gx:criteria"];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...cleanedCriteria } = criteria || {};

  const dataCriteriaList = Object.entries(cleanedCriteria).map(
    ([key, value]) => ({
      name: key.substring(3),
      ...(typeof value === "object" && value !== null ? value : {}),
    })
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalCriteriaList = dataCriteriaList.map((ele: any) => {
    return {
      description: ele["gx:description"],
      response: ele["gx:response"],
      name: ele.name,
      evidence: ele["gx:evidence"],
      reason: ele["gx:reason"],
    };
  });

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await selfDescriptionApiService.deleteServiceOffering(
        selfDescriptionHash
      );
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

  const handleDownloadContract = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sdName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAccessData = async () => {
    const dataLink = content.verifiableCredential.find(
      (vc: any) => vc.type.indexOf("gx:ServiceAccessPoint") !== -1
    )?.credentialSubject["gx:openAPI"];
    try {
      await selfDescriptionApiService.accessData(dataLink);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfo();
      const userId = userInfo?.profile.sub || "";
      setUserId(userId);
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userId && content) {
      checkSignedContract();
    }
  }, [userId, content.id]);

  const checkSignedContract = () => {
    const existingDescriptions = JSON.parse(
      sessionStorage.getItem("selfDescriptions") || "[]"
    );
    const signedContractFound = existingDescriptions.find(
      (ele: { userId: string; selfDescriptionId: string }) =>
        ele.userId === userId && ele.selfDescriptionId === content.id
    );
    if (signedContractFound) {
      setIsContractSignedSubmitted(true);
    }
    else setIsContractSignedSubmitted(false);
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadContract}
          >
            Download contract template
          </Button>
          {isContractSignedSubmitted ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleAccessData}
            >
              Access data
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => setOpenUploadContractModal(true)}
            >
              Request dataset access
            </Button>
          )}
        </Box>
        <Button
          variant="contained"
          color="error"
          sx={{visibility: "hidden"}}
          onClick={() => setOpenDeleteDialog(true)}
        >
          Delete
        </Button>
      </Box>
      {/* Header Section */}
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
        <LeftCard
          sdName={sdName}
          issuer={issuer}
          status={status}
          statusDatetime={issuanceDate}
          uploadDatetime={statusDatetime}
          issuerName={issuerName}
          complianceCheck={complianceCheck}
        />
      </Box>

      {/* Accordion Section */}
      {[
        { title: "General Dataset Information", data: generalDatasetInfoList },
        { title: "Dataset contacts", data: datasetContactsList },
        { title: "Data Sharing Agreement (DSA)", data: null },
      ].map((section, index) => (
        <Accordion
          key={index}
          defaultExpanded
          sx={{
            mb: 2,
            "&:before": { display: "none" }, // Removes the default underline
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
            sx={{
              bgcolor: "grey.100",
              "&:hover": { bgcolor: "grey.200" },
              transition: "background-color 0.3s ease",
            }}
          >
            <Typography fontWeight="bold">{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: "background.default", p: 2 }}>
            {section.data ? (
              <KeyValueCard keyValueList={section.data} />
            ) : (
              <Link href={termsAndConditionsUrl} target="_blank">
                Download document
              </Link>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Policies section it will be commented for now */}
      <Accordion
        sx={{
          mb: 2,
          "&:before": { display: "none" },
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="use-restrictions-content"
          id="use-restrictions-header"
          sx={{
            bgcolor: "grey.100",
            "&:hover": { bgcolor: "grey.200" },
            transition: "background-color 0.3s ease",
          }}
        >
          <Typography fontWeight="bold">Use Restrictions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {[
            {
              title: "Permissions",
              text: "Content for Permissions will go here.",
            },
            {
              title: "Constrained Permissions",
              text: "Content for Constrained Permissions will go here.",
            },
            {
              title: "Obligations",
              text: "Content for Obligations will go here.",
            },
          ].map((sectionTitle, index) => (
            <Accordion
              key={index}
              sx={{
                mb: 2,
                "&:before": { display: "none" },
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${sectionTitle.title.toLowerCase()}-content`}
                id={`${sectionTitle.title.toLowerCase()}-header`}
                sx={{
                  bgcolor: "grey.100",
                  "&:hover": { bgcolor: "grey.200" },
                  transition: "background-color 0.3s ease",
                }}
              >
                <Typography fontWeight="bold">{sectionTitle.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {sectionTitle.text}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* criteria section*/}

      {finalCriteriaList && finalCriteriaList.length > 0 && (
        <Accordion
          sx={{
            mb: 2,
            "&:before": { display: "none" },
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="criteria-content"
            id="criteria-header"
            sx={{
              bgcolor: "grey.100",
              "&:hover": { bgcolor: "grey.200" },
              transition: "background-color 0.3s ease",
            }}
          >
            <Typography fontWeight="bold">{criteriaType}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {finalCriteriaList.length > 0 ? (
              <CriteriaSection list={finalCriteriaList} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No criteria available.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" color="text.secondary" align="center">
        Last updated: {formatDate(statusDatetime)}
      </Typography>

      <SimpleDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        title={"Delete Data Offer"}
        description={
          "Are you sure you want to delete this data offer? This action cannot be undone."
        }
        handleConfirmDelete={handleConfirmDelete}
        loading={loading}
      />
      <OnboardDialog
        open={openUploadContractModal}
        setOpen={setOpenUploadContractModal}
        refreshList={() => setIsContractSignedSubmitted(true)}
        dialogTitle="Upload the signed contract"
        selfDescriptionType="makeContract"
        selfDescriptionId={content.id}
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
