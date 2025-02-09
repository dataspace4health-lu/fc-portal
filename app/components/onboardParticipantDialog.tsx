import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  styled,
  useTheme,
  Box,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Grid from "@mui/material/Grid2";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface ResponsiveDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function OnboardParticipant(props: ResponsiveDialogProps) {
  const { open, setOpen } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [mode, setMode] = React.useState<"file" | "text">("file");
  const [files, setFiles] = React.useState<File[]>([]);
  const [textInput, setTextInput] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [jsonContent, setJsonContent] = React.useState<object | null>(null); // Store parsed JSON
  const [isDragging, setIsDragging] = React.useState(false);

  console.log("jsonContent", jsonContent);

  const handleClose = () => {
    setOpen(false);
  };

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: "file" | "text"
  ) => {
    if (newMode) {
      setMode(newMode);
      setFiles([]); // Reset file selection when switching modes
      setTextInput(""); // Reset text input when switching modes
      setJsonContent(null);
      setError(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    handleFiles(event.target.files);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleFiles = (selectedFiles: FileList) => {
    const allowedTypes = ["application/json", "application/pdf"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const validFiles: File[] = [];
    let errorMsg = "";

    Array.from(selectedFiles).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errorMsg = "Invalid file type. Only JSON and PDF are allowed.";
      } else if (file.size > maxFileSize) {
        errorMsg = "File size exceeds the 5MB limit.";
      } else {
        validFiles.push(file);
        if (file.type === "application/json") {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const parsedData = JSON.parse(e.target?.result as string);
              setJsonContent(parsedData); // Store parsed JSON in state
            } catch (err) {
              console.error(err);
              setError("Error parsing JSON file.");
            }
          };
          reader.readAsText(file);
        }
      }
    });

    setError(errorMsg);
    if (validFiles.length > 0) setFiles(validFiles);
  };

  const handleUpload = () => {
    setUploading(true);

    setTimeout(() => {
      setUploading(false);
      setFiles([]);
      setTextInput("");
      setJsonContent(null);
      setError(null);
      setOpen(false);
    }, 2000);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="lg" // Make the dialog wider
        fullWidth={true} // Ensure it takes the full available width
      >
        <DialogTitle id="responsive-dialog-title">
          Onboard New Participant
        </DialogTitle>
        <DialogContent sx={{ minWidth: 700, minHeight: 500 }}>
          {" "}
          {/* Adjust size */}
          <Grid>
            <Box sx={{ mb: 2, textAlign: "center" }}>
              <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={handleModeChange}
                sx={{ mt: 1 }}
              >
                <ToggleButton value="file">
                  <CloudUploadIcon sx={{ mr: 1 }} />
                  Upload verifiable credential file
                </ToggleButton>
                <ToggleButton value="text">
                  <TextFieldsIcon sx={{ mr: 1 }} />
                  Enter verifiable credential manually
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* File Upload Mode */}
            {mode === "file" && (
              <Box
                sx={{
                  border: `2px dashed ${isDragging ? "#2196f3" : "#ccc"}`,
                  backgroundColor: isDragging ? "#e3f2fd" : "transparent",
                  padding: 3,
                  borderRadius: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                  transform: isDragging ? "scale(1.01)" : "scale(1)",
                  "&:hover": { backgroundColor: "#f9f9f9" },
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <UploadFileIcon
                  sx={{
                    fontSize: 50,
                    color: isDragging ? "#2196f3" : "#666",
                    transition:
                      "color 0.3s ease-in-out, transform 0.3s ease-in-out",
                    transform: isDragging ? "rotate(-10deg)" : "rotate(0deg)",
                  }}
                />
                <Typography variant="h6">
                  Upload Verifiable Credentials
                </Typography>
                <Typography variant="body2">
                  Drag and drop files here
                </Typography>
                <Typography variant="body2">or</Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Browse
                  <VisuallyHiddenInput
                    type="file"
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            )}

            {/* Text Input Mode */}
            {mode === "text" && (
              <TextField
                fullWidth
                id="vc"
                name="Verifiable Credential"
                label="Participant Verifiable Credential"
                multiline
                rows={12} // More space for text input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                sx={{ mt: 2 }}
              />
            )}

            {/* Display Selected Files */}
            {files.length > 0 && mode === "file" && (
              <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
                <Typography variant="subtitle1">Selected File:</Typography>
                {files.map((file, index) => (
                  <Typography key={index} variant="body2">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Typography>
                ))}
              </Paper>
            )}

            {/* Error Message */}
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            {/* Uploading Progress */}
            {uploading && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 1 }}>Uploading...</Typography>
              </Box>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              (mode === "file" && files.length === 0) ||
              (mode === "text" && !textInput) ||
              uploading
            }
          >
            {uploading ? "Uploading..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
