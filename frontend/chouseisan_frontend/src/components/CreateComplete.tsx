import React, { useState, ChangeEvent, useEffect } from "react";
import { Link, Location, useLocation, useParams } from "react-router-dom";
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
import axios from "../utils/axios";
interface NextPageParams {
  uuid: string;
}
export default function CreateComplete() {
  const location = useLocation();
  const params = useParams();
  const textUrl =
    "http://localhost:3000/scheduler/create_complete/" + params.eventId;
  const [url, setUrl] = useState<string | undefined>(textUrl);
  console.log(params.eventId);
  useEffect(()=>{
    axios.get(`/`)
  })
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
