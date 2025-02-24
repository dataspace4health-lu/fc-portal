import { Snackbar, Alert } from "@mui/material";

interface SnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "error";
  onClose: () => void;
}

const SnackbarComponent = ({ open, message, severity, onClose }: SnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000} // 4 seconds
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
