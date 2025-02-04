"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  maxWidth: "800px",
  height: "80%",
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  margin: "auto",
  borderRadius: theme.spacing(2),
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
}));

const OnboardingContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(4),
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.background.default,
  backgroundImage: `radial-gradient(circle, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
}));

export default function Onboarding() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);

  };

  const handleReturnToSignIn = () => {
    router.push("");
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <OnboardingContainer>
        <Card>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            Participant Self-Description
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <FormControl fullWidth>
              <TextField
                id="selfDescription"
                name="selfDescription"
                label="Participant Self-Description"
                placeholder="Write your self-description here..."
                multiline
                rows={12}
                variant="outlined"
              />
            </FormControl>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={handleReturnToSignIn}
              >
                Return to Sign In
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  paddingX: 4,
                  paddingY: 1.2,
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Card>
      </OnboardingContainer>
    </>
  );
}
