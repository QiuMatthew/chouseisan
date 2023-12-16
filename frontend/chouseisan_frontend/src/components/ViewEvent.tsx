import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Link } from "@mui/material";
import "./ViewEvent.css";
import FlagIcon from "@mui/icons-material/Flag";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import DateProposalGrid from "./DateProposalGrid";
import noIcon from "../images/no.png";
export default function ViewEvent() {
  const event = {
    eventName: "meeting",
    eventDetail: "123",
    respondents: 2,
  };
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [no, setNo] = useState(0);

  React.useEffect(() => {
    axios
      .get(`/eventBasic`)
      .then((response) => {
        setName(response.data.name);
        setNo(response.data.number);
        setDetail(response.data.detail);
      })
      .catch((reason) => {
        console.log(reason);
        console.log("ERROR connecting backend service");
      });
  }, []);
  return (
    <>
      <div className="container1">
        <Link
          href="/scheduler"
          color={"#a46702"}
          underline="hover"
          sx={{ marginBottom: "15px" }}
        >
          Host a new event
        </Link>
        <div className="event-header">
          {name}
          <Button
            variant="outlined"
            sx={{
              position: "absolute",
              right: 0,
              fontSize: 15,
            }}
          >
            Edit this event
          </Button>
        </div>
        <p className="event-info">
          <span className="no-label">No. of respondents</span>
          {no}
          <span style={{ marginLeft: "30px", fontSize: 14 }}>
            You are the event organizer
          </span>
        </p>
        <div style={{ minHeight: "150px" }}>
          {detail !== "" && (
            <>
              <p className="event-detail">Event Details</p>
              <p>{detail}</p>
            </>
          )}
        </div>
      </div>
      <Box sx={{ background: "#f9f9f9" }}>
        <div className="container2">
          <p className="event-detail">Date Proposals</p>
          <p>Click on the name to edit your response.</p>
          <DateProposalGrid />
        </div>
      </Box>
    </>
  );
}
