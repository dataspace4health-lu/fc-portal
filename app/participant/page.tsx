"use client";
import * as React from "react";
import { Box, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import LeftCard from "../components/leftCard";
import MenuAppBar from "../components/appBar";
import SearchBar from "../components/searchComponent";
import SelectInput from "../components/selectInput";
import CustomSeparator from "../components/pathSeperation";
import DetailsData from "../components/detailsCard";

const mockData = [
  {
    id: "1",
    name: "NTT LUXEMBOURG PSF S.A",
    logo: "Details for Card 1",
    address: "Luxembourg - Capellen",
    vatNumber: "LU20769255",
  },
  {
    id: "2",
    name: "Luxembourg Institute of Health",
    logo: "Details for Card 2",
    address: "Luxembourg - Capellen",
    vatNumber: "LU20769255",
  },
  {
    id: "3",
    name: "Agence national des information",
    logo: "Details for Card 3",
    address: "Luxembourg - Capellen",
    vatNumber: "LU20769255",
  },
  {
    id: "4",
    name: "HRS - Hopitaux",
    logo: "Details for Card 4",
    address: "Luxembourg - Capellen",
    vatNumber: "LU20769255",
  },
];

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
  { label: "value 1", id: "1" },
  { label: "value 2", id: "2" },
  { label: "value 3", id: "3" },
  { label: "value 4", id: "4" },
];

export default function Dashboard() {
  const [selectedCard, setSelectedCard] = React.useState(mockData[0]);

  const handleCardClick = (card: (typeof mockData)[0]) => {
    setSelectedCard(card);
  };

  return (
    <div>
      <MenuAppBar />
      <CustomSeparator />
      <SearchBar />
      <SelectInput options={options} fieldLabel="Sorted by"/>
      <Grid container sx={{ height: "100vh" }}>
        {/* Left Pane: Vertical Cards */}
        <Grid size={{ xs: 4, md: 4 }}>
          <Sidebar>
            {mockData.map((card) => (
              <Grid
                key={card.id}
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  border:
                    card.id === selectedCard.id ? "2px solid #1976d2" : "none",
                }}
                onClick={() => handleCardClick(card)}
              >
                <LeftCard
                  id={card.id}
                  name={card.name}
                  vatNumber={card.vatNumber}
                  address={card.address}
                  logoUrl={card.logo}
                />
              </Grid>
            ))}
          </Sidebar>
        </Grid>

        {/* Right Pane: Card Details */}
        <Grid size={{ xs: 8, md: 8 }}>
          <DetailsPane>
            <Typography variant="h4" gutterBottom>
              {selectedCard.name}
            </Typography>
            <Paper elevation={3}>
              <DetailsData />
            </Paper>
          </DetailsPane>
        </Grid>
      </Grid>
    </div>
  );
}
