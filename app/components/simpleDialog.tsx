import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface DialogInterface {
  open: boolean;
  setOpen: (val: boolean) => void;
  title: string;
  description: string;
  handleConfirmDelete: () => void;
  loading: boolean
}
export default function SimpleDialog(props: DialogInterface) {
  const { open, setOpen, title, description, handleConfirmDelete, loading } = props;
  //   const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>

        <Button onClick={handleClose} disabled={loading}>
          {loading ? "Loading..." : "Cancel"}
        </Button>
        {!loading && <Button onClick={handleConfirmDelete} autoFocus>
          Confirm
        </Button>}
      </DialogActions>
    </Dialog>
  );
}
