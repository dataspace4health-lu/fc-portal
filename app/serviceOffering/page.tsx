"use client";
// import * as React from "react";
// import { Box, Typography, Paper } from "@mui/material";
// import Grid from "@mui/material/Grid2";
// import { styled } from "@mui/material/styles";
// import LeftCard from "../components/leftCard";
// import MenuAppBar from "../components/appBar";
import CustomSeparator from "../components/pathSeperation";
// import ServiceOfferingDetailsData from "../components/serviceOfferingDetails";
// import {
//   Configuration,
//   SelfDescriptions,
//   SelfDescriptionsApi,
// } from "@/services/api-client";
// import { useEffect, useState } from "react";
// import { getToken } from "../components/oidcIntegration";
import ProtectedRoute from "../components/protectedRoute";

// const mockData = [
//   {
//     id: "1",
//     name: "NTT LUXEMBOURG PSF S.A",
//     logo: "",
//     address: "Luxembourg - Capellen",
//     vatNumber: "LU20769255",
//   },
//   {
//     id: "2",
//     name: "Luxembourg Institute of Health",
//     logo: "",
//     address: "Luxembourg - Capellen",
//     vatNumber: "LU20769255",
//   },
//   {
//     id: "3",
//     name: "Agence national des information",
//     logo: "",
//     address: "Luxembourg - Capellen",
//     vatNumber: "LU20769255",
//   },
//   {
//     id: "4",
//     name: "HRS - Hopitaux",
//     logo: "",
//     address: "Luxembourg - Capellen",
//     vatNumber: "LU20769255",
//   },
// ];

// const Sidebar = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   padding: theme.spacing(2),
//   height: "100vh",
//   overflowY: "auto",
// }));

// const DetailsPane = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   height: "100vh",
//   overflowY: "auto",
//   backgroundColor: theme.palette.background.default,
// }));

// const options = [
//   { label: "value 1", id: "1" },
//   { label: "value 2", id: "2" },
//   { label: "value 3", id: "3" },
//   { label: "value 4", id: "4" },
// ];

// const CardContainer = styled(Grid, {
//   shouldForwardProp: (prop) => prop !== "isSelected",
// })<{ isSelected: boolean }>(({ theme, isSelected }) => ({
//   marginBottom: theme.spacing(2),
//   cursor: "pointer",
//   padding: theme.spacing(2),
//   border: isSelected
//     ? `2px solid ${theme.palette.primary.main}`
//     : "1px solid transparent",
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: isSelected ? theme.shadows[4] : theme.shadows[1],
//   transition: "all 0.3s ease-in-out",
//   "&:hover": {
//     boxShadow: theme.shadows[6],
//     transform: "scale(1.02)",
//   },
// }));

const ServiceOffering = () => {
  // const [selectedCard, setSelectedCard] = useState(mockData[0]);
  // const [token, setToken] = useState<string>();
  // const [selfDescriptionsData, setSelfDescriptionsData] =
  //   useState<SelfDescriptions>();
  // const apiConfig = new Configuration({
  //   basePath: process.env.NEXT_PUBLIC_API_BASE_URL,
  //   accessToken: token,
  // });
  // const selfDescriptionApi = new SelfDescriptionsApi(apiConfig);

  // const handleCardClick = (card: (typeof mockData)[0]) => {
  //   setSelectedCard(card);
  // };

  // useEffect(() => {
  //   async function fetchToken() {
  //     const token = await getToken();
  //     setToken(token);
  //   }
  //   fetchToken();
  // }, []);

  // useEffect(() => {
  //   if (token) {
  //     async function fetchData() {
  //       try {
  //         const response = await selfDescriptionApi.readSelfDescriptions();
  //         setSelfDescriptionsData(response.data);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //     fetchData();
  //   }
  // }, [token]);

  // console.log("selfDescriptionsData", selfDescriptionsData);

  return (<><CustomSeparator /></>)
  //     <div>
  //       <MenuAppBar />
  //       <Box sx={{ py: 1 }}>
          
  //         <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
  //           <Grid size={{ xs: 4 }} sx={{ textAlign: "right" }}>
  //             {/* <SelectInput options={options} fieldLabel="Sorted by" /> */}
  //           </Grid>
  //           <Grid size={{ xs: 8 }}>
  //             {/* <SearchBar /> */}
  //           </Grid>
  //         </Grid>
  //       </Box>
  //       <Grid container sx={{ height: "100vh" }}>
  //         {/* Left Pane: Vertical Cards */}
  //         <Grid size={{ xs: 4 }}>
  //           <Sidebar>
  //             {mockData.map((card) => (
  //               <CardContainer
  //                 key={card.id}
  //                 isSelected={card.id === selectedCard.id}
  //                 onClick={() => handleCardClick(card)}
  //               >
  //                 <LeftCard
  //                   id={card.id}
  //                   name={card.name}
  //                   vatNumber={card.vatNumber}
  //                   address={card.address}
  //                   logoUrl={card.logo}
  //                 />
  //               </CardContainer>
  //             ))}
  //           </Sidebar>
  //         </Grid>

  //         {/* Right Pane: Card Details */}
  //         <Grid size={{ xs: 8, md: 8 }}>
  //           <DetailsPane>
  //             <Typography variant="h4" gutterBottom>
  //               {selectedCard.name}
  //             </Typography>
  //             <Paper elevation={3}>
  //               <ServiceOfferingDetailsData />
  //             </Paper>
  //           </DetailsPane>
  //         </Grid>
  //       </Grid>
  //     </div>
  // );
}

export default ProtectedRoute(ServiceOffering)
