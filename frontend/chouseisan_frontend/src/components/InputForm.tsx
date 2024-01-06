import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

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
import dayjs from "dayjs";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
  FormProvider,
} from "react-hook-form";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HelpIcon from "@mui/icons-material/Help";
import "./InputForm.css";
import topIcon from "../images/top.png";
import FlagIcon from "@mui/icons-material/Flag";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers";
import * as timezone from "dayjs/plugin/timezone";
import axios from "../utils/axios";
// type CustomLocation = {
//   state: { from: { pathname: string } };
// };

export default function InputForm() {
  const [dateList, setDateList] = React.useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [uuid, setUuid] = useState("");
  const navigate = useNavigate();
  const utc = require("dayjs/plugin/utc");
  const timezone = require("dayjs/plugin/timezone");

  const japanTime = dayjs();
  const eventSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      // "http://localhost:8080/"
      .post(
        `/event`,
        {
          title: title,
          detail: detail,
          dateTimeProposal: dateList,
        },

        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then(function (response) {
        let uuid = response.data.event_id.replace(/-/g, "");
        navigate(`/create_complete/${uuid}`);
      })
      .catch(function (response) {
        console.log("ERROR connecting backend service");
      });
  };
  // console.log(dayjs.unix(1699255903).format("YYYY-MM-DD HH:mm:ss"));
  return (
    <>
      <Box sx={{ backgroundColor: "#6dd643", height: 350, marginBottom: 0 }}>
        <div
          style={{
            margin: "0 auto",
            width: 970,
            position: "relative",
          }}
        >
          <img src={topIcon} height="auto" width={"100%"} />
          <div
            style={{
              left: 20,
              position: "absolute",
              top: 8,
              width: 640,
              color: "white",
              borderRadius: 10,
            }}
          >
            <h2>
              Chouseisan organizes every detail about your event! It all starts
              by creating an event page!
            </h2>
          </div>
        </div>
      </Box>
      <Box
        sx={{
          backgroundColor: "#eaf4e5",
          height: 600,
        }}
      >
        <form className="container" onSubmit={eventSubmit}>
          <h2 className="form-header">
            <FlagIcon />
            Create your event page
          </h2>
          <div className="form">
            <div className="box1">
              <div className="event-box">
                <p className="item-title">
                  <span className="step-label">STEP1</span>Event Title
                </p>
                <p className="item-description">
                  “Team Dinner Party”, “Project Meeting”, etc...
                </p>
                <TextField
                  // size="small"
                  label="Title"
                  fullWidth
                  inputProps={{ style: { padding: 0 } }}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                ></TextField>
              </div>
              <div className="event-box">
                <p className="item-title">Event Details (Optional)</p>
                <p className="item-description">
                  Let’s schedule the party! Please respond by ______
                </p>
                <TextField
                  size="small"
                  label="Detail"
                  multiline
                  fullWidth
                  rows={6}
                  inputProps={{ style: { padding: 0 } }}
                  onChange={(e) => setDetail(e.target.value)}
                ></TextField>
              </div>
            </div>
            <div className="box2">
              <div className="event-box">
                <p className="item-title">
                  <span className="step-label">STEP2</span>Date/Time Proposals
                </p>
                <p className="item-description">
                  List the dates and corresponding times propose to host an
                  event.<br></br>*Input one proposal per line.
                </p>
                <p className="item-description">
                  Example:<br></br>　Aug 7(Mon) 20:00～<br></br>　Aug 8(Tue)
                  20:00～<br></br>　Aug 9(Wed) 21:00～
                </p>

                <TextField
                  size="small"
                  multiline
                  fullWidth
                  rows={7}
                  label="Proposal"
                  inputProps={{ style: { padding: 0 } }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDateList(event.target.value);
                  }}
                  value={dateList}
                  placeholder="Simply input your proposals in the Month DD(DAY) TIME format. Or you can click on the specific date(s) in the calendar."
                ></TextField>
              </div>
            </div>
            <div className="box3">
              <p className="item-description">
                ↓Click on the specific date(s) you want to propose.
              </p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  defaultValue={dayjs(japanTime)}
                  sx={{ overflow: "visible" }}
                  disablePast
                  onChange={(date) => {
                    //set to asia/tokyo timezone
                    const origin = date!.add(9, "hour").toString();
                    let res = `${origin.slice(8, 11)} ${origin.slice(
                      5,
                      7
                    )}(${origin.slice(0, 3)}) ${origin.slice(17, 22)}～`;
                    setDateList((dateList) => {
                      if (dateList) dateList += `\n`;
                      dateList += `${res}`;
                      return dateList;
                    });
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <Button
            sx={{
              width: 700,
              position: "absolute",
              transform: "translate(-50%, -50%)",
              marginTop: 5,
              left: "50%",
              height: 50,
            }}
            variant="contained"
            size="large"
            type="submit"
          >
            <FlagIcon />
            Create An Event Page!
          </Button>
        </form>
      </Box>
    </>
  );
}
