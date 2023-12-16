import React, { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  Stack,
  TextField,
  FormControl,
  Button,
  FormHelperText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  Grid,
  Autocomplete,
  CircularProgress,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import "./CreateComplete.css";
export default function CreateComplete() {
  const [url, setUrl] = useState("http://localhost:3000/scheduler/create_complete?h=d4fd82c927564792a4cf2a855464f944");
  return (
    <>
      <div className="container">
        <h2 className="form-header">Your event page is ready to be shared!</h2>
        <h4 className="description">
          Your event page is created! You can start inviting people by sharing
          the URL below! Using the URL, your peers can submit when they are
          available to meet.
        </h4>
        <TextField
          size="small"
          fullWidth
          // defaultValue={"https://chouseisan.com"}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
        <Button
          size="large"
          variant="contained"
          component={Link}
          to="/view_event"
          sx={{
            width: 300,
            height: 50,
            marginTop: 10,
            left: "50%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            borderRadius: 3,
          }}
        >
          Go to your event page
        </Button>
      </div>
    </>
  );
}
