/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Drawer,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import MenuAppBar from "../components/appBar";
import CustomSeparator from "../components/pathSeperation";
import { useEffect, useMemo, useState } from "react";
import ApiService from "../apiService/apiService";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface Column {
  id: "username" | "firstName" | "lastName" | "email" | "participantId";
  label: string;
  minWidth?: number;
}

const columns: readonly Column[] = [
  { id: "username", label: "Username", minWidth: 50 },
  { id: "email", label: "Email", minWidth: 50 },
  { id: "firstName", label: "First Name", minWidth: 50 },
  { id: "lastName", label: "Last Name", minWidth: 50 },
  { id: "participantId", label: "Participant", minWidth: 50 },
];

interface Users {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  participantId: string;
  roleIds: string[];
  username: string;
}

export default function UsersManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState<Users[]>([]);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Users | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    participantId: "",
  });

  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [participants, setParticipants] = useState([{ id: "", name: "" }]);

  const router = useRouter();

  const apiService = useMemo(
    () => new ApiService(() => router.push("/")),
    [router]
  );

  async function fetchUsers() {
    try {
      const response: any = await apiService.getUsers();
      if (response?.data?.items) {
        setUsers(response.data.items);
      }
    } catch (err) {
      console.error(err || "An error occurred");
    }
  }

  async function fetchRoles() {
    try {
      const rolesList: any = await apiService.getRoles();
      setRoles(rolesList?.data);
    } catch (err) {
      console.error(err || "An error occurred");
    }
  }

  async function fetchParticipants() {
    try {
      const response: any = await apiService.getParticipants();
      setParticipants(response?.data?.items);
    } catch (err) {
      console.error(err || "An error occurred");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRowClick = (user: Users) => {
    fetchRoles();
    fetchParticipants();
    setSelectedUser(user);
    setSelectedRoles(user.roleIds);
    setEditedUser(user);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleCloseDrawer = () => {
    setSelectedUser(null);
    setIsCreating(false);
    setIsEditing(false);
    setSelectedRoles([]);
    setParticipants([]);
    setNewUser({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      participantId: "",
    });
  };

  const handleNewUserChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name!]: value });
  };

  const handleEditUserChange = (e: React.ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    if (editedUser) {
        const { name, value } = e.target;
      setEditedUser({ ...editedUser, [name!]: value });
    }
  };

  const handleUpdateUser = async () => {
    if (!editedUser) return;
    try {
      const userToUpdate = {
        ...editedUser,
        roleIds: selectedRoles,
      };
      await apiService.updateUser(userToUpdate.id, userToUpdate);
      setUsers(users.map((u) => (u.id === userToUpdate.id ? userToUpdate : u)));
      setSelectedUser(userToUpdate);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await apiService.deleteUser(selectedUser.id);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      handleCloseDrawer();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleOnAddClick = async () => {
    try {
      setIsCreating(true);
      setSelectedUser(null);
      fetchRoles();
      fetchParticipants();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRoles((prevRoles) =>
      prevRoles.includes(roleId)
        ? prevRoles.filter((id) => id !== roleId)
        : [...prevRoles, roleId]
    );
  };

  const handleCreateUser = async () => {
    try {
      const userToCreate = {
        ...newUser,
        roleIds: selectedRoles,
      };
      const response = await apiService.createUser(userToCreate);
      if (response) {
        setUsers([...users, { ...response.data, roleIds: response.data.roleIds || [] }]);
        handleCloseDrawer();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <MenuAppBar />
      <Box sx={{ py: 1 }}>
        <CustomSeparator />
        <Box
          sx={{
            display: "flex",
            transition: "margin 0.3s ease",
            marginRight: selectedUser ? "300px" : "0px",
          }}
        >
          <Paper sx={{ flex: 1, m: 6, p: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
              onClick={handleOnAddClick}
            >
              New User
            </Button>

            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow
                        hover
                        key={user.id}
                        onClick={() => handleRowClick(user)}
                        sx={{ cursor: "pointer" }}
                      >
                        {columns.map((column) => (
                          <TableCell key={column.id}>
                            {user[column.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
            />
          </Paper>
          <Drawer
            anchor="right"
            open={Boolean(selectedUser)}
            onClose={handleCloseDrawer}
            sx={{
              width: 300,
              flexShrink: 0,
              "& .MuiDrawer-paper": { width: 300, padding: 2, boxShadow: 3 },
            }}
            ModalProps={{
              keepMounted: true,
              BackdropProps: { invisible: true },
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  {isEditing ? "Edit User" : "User Details"}
                </Typography>
                <IconButton onClick={handleCloseDrawer}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {selectedUser && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {columns.map(({ id, label }) => (
                    <TextField
                      key={id}
                      name={id}
                      label={label}
                      value={editedUser?.[id] || ""}
                      fullWidth
                      onChange={(e) => handleEditUserChange(e as React.ChangeEvent<HTMLInputElement>)}
                      disabled={!isEditing}
                    />
                  ))}

                  <FormControl fullWidth>
                    <InputLabel id="participant-label">
                      Select Participant
                    </InputLabel>
                    <Select
                      labelId="participant-label"
                      name="participantId"
                      value={selectedUser.participantId}
                      onChange={handleEditUserChange}
                      disabled={!isEditing}
                    >
                      {participants.map((participant) => (
                        <MenuItem key={participant.id} value={participant.id}>
                          {participant.name}{" "}
                          {/* Assuming participants have 'id' and 'name' */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormGroup>
                    {roles?.map((role) => (
                      <FormControlLabel
                        disabled={!isEditing}
                        key={role}
                        control={
                          <Checkbox
                            checked={selectedRoles.includes(role)}
                            onChange={() => handleRoleChange(role)}
                          />
                        }
                        label={role}
                      />
                    ))}
                  </FormGroup>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  {isEditing && (
                    <Button startIcon={<SaveIcon />} onClick={handleUpdateUser}>
                      Save Changes
                    </Button>
                  )}
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={handleDeleteUser}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          </Drawer>
          {roles && participants && (
            <Dialog open={isCreating} onClose={() => setIsCreating(false)}>
              <DialogTitle variant="h4">Create User</DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      name="username"
                      label="Username"
                      fullWidth
                      onChange={(e) => handleNewUserChange(e as SelectChangeEvent<string>)}
                    />
                    <TextField
                      name="email"
                      label="Email"
                      fullWidth
                      onChange={handleNewUserChange}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      onChange={handleNewUserChange}
                    />
                    <TextField
                      name="firstName"
                      label="First Name"
                      fullWidth
                      onChange={handleNewUserChange}
                    />
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel id="participant-label">
                      Select Participant
                    </InputLabel>
                    <Select
                      labelId="participant-label"
                      name="participantId"
                      value={newUser.participantId}
                      onChange={handleNewUserChange}
                    >
                      {participants.map((participant) => (
                        <MenuItem key={participant.id} value={participant.id}>
                          {participant.name}{" "}
                          {/* Assuming participants have 'id' and 'name' */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography variant="h6">Select Roles</Typography>
                  <Grid container spacing={2}>
                    {roles?.map((role) => (
                      <Grid size={{ xs: 4 }} key={role}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedRoles.includes(role)}
                              onChange={() => handleRoleChange(role)}
                            />
                          }
                          label={role}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDrawer}>Cancel</Button>
                <Button variant="contained" onClick={handleCreateUser}>
                  Create User
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </Box>
    </>
  );
}
