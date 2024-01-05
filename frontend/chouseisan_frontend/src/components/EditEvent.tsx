import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Routes,
  Route,
  Link as Link2,
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
  Link,
  Tab,
  Divider,
  Theme,
  createStyles,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ButtonGroup,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
import "./EditEvent.css";
import { makeStyles } from "@mui/material";
import topIcon from "../images/top.png";
import FlagIcon from "@mui/icons-material/Flag";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers";
import * as timezone from "dayjs/plugin/timezone";
import axios from "axios";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
  GridClasses,
} from "@mui/x-data-grid";
import DateProposalGrid from "./DateProposalGrid";

// type CustomLocation = {
//   state: { from: { pathname: string } };
// };
// const useStyles = makeStyles((theme:Theme) =>
//   createStyles({
//     tableCell: {
//       borderRight: "1px solid #ddd", // 设置竖线样式
//       padding: "8px", // 调整单元格的内边距
//       weight: 210,
//       fontSize: 18,
//       fontWeight: 800,
//     }
//   })
// );
export default function EditEvent() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [no, setNo] = useState(0);
  const [clicked, setClicked] = useState(false);
  const japanTime = dayjs();
  const [dateList, setDateList] = useState([
    "123456",
    "789012",
    "sdfoiuhiodfsh",
  ]);
  const [newList, setNewList] = useState("");
  const navigate = useNavigate();
  const [addDate, setAddDate] = useState("");
  let addDate2 = "";
  const utc = require("dayjs/plugin/utc");
  const leftCellStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    borderRight: "1px solid #ddd",
    width: "210px",
    padding: "18px",
  };
  const rightCellStyle = {
    padding: "10px",
  };
  
  // const classes = useStyles();
  return (
    <>
      <p className="firstLink">
        <Link
          href="/scheduler/view_event"
          color={"#a46702"}
          underline="hover"
          sx={{ marginBottom: "15px" }}
        >
          {title}
        </Link>
        {" > "}Edit/Delete Event
      </p>
      <div className="container1">
        <div className="event-header1">Edit/Delete Event</div>

        {/* <p style={{}}></p> */}
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            border: "1px solid #ccc",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell style={leftCellStyle}>Event Title</TableCell>
                <TableCell style={rightCellStyle}>
                  <TextField
                    fullWidth
                    helperText="Team Dinner Party”, “Project Meeting”, etc..."
                  ></TextField>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={leftCellStyle}>Event Details</TableCell>
                <TableCell style={rightCellStyle}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    helperText="*Let’s schedule the party! Please respond by ___"
                  ></TextField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={leftCellStyle}>Date Proposals</TableCell>
                <TableCell style={rightCellStyle}>
                  <h2>Delete proposed dates</h2>
                  <List>
                    {dateList.map((value, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          maxWidth: 500,
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          margin: "8px 0",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => {
                              const updatedList = [...dateList];
                              updatedList.splice(index, 1);
                              setDateList(updatedList);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                        <ListItemText primary={value} />
                      </ListItem>
                    ))}
                  </List>
                  <h2>Add proposed dates</h2>
                  <p>Please enter the new proposed dates.</p>
                  <div className="form">
                    <TextField
                      fullWidth
                      helperText=""
                      multiline
                      rows={15}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setNewList(event.target.value);
                      }}
                      value={newList}
                      placeholder="Simply input your proposals in the Month DD(DAY) TIME format. Or you can click on the specific date(s) in the calendar."
                    ></TextField>

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
                          setNewList((newList) => {
                            if (newList) newList += `\n`;
                            newList += `${res}`;
                            return newList;
                          });
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <ButtonGroup
          sx={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            marginTop: 5,
            marginBottom: 10,
            left: "50%",
            height: 50,
          }}
        >
          <Button
            sx={{
              marginRight: "58px",
              borderRadius: 0,
              width: 150,
            }}
            variant="contained"
          >
            Go Back
          </Button>
          <Button sx={{ borderRadius: 0, width: 300 }} variant="contained">
            Save Changes
          </Button>
        </ButtonGroup>
        <div className="event-header2">Edit/Delete Event</div>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            border: "1px solid #ccc",
            marginBottom: 20,
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    ...leftCellStyle,
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  Cancel your event
                </TableCell>
                <TableCell
                  style={{
                    ...rightCellStyle,
                    flexDirection: "column",
                    display: "flex",
                  }}
                >
                  {clicked && (
                    <p className="warning">
                      Are you sure you want to delete this event?<br></br>Once
                      you delete an event, it cannot be recovered.<br></br>If
                      you are sure, please press the "Delete Event" button.
                    </p>
                  )}
                  <Button
                    sx={{
                      width: 400,
                      marginTop: 1,
                      marginBottom: 3,
                      border: clicked ? "1px solid red" : "1px solid", // 根据点击状态设置边框颜色
                      "&:hover": {
                        border: clicked ? "1px solid red" : "1px solid", // 根据点击状态设置悬停时的边框颜色
                      },
                    }}
                    onClick={() => {
                      setClicked(true);
                      if (clicked) {
                      }
                    }}
                  >
                    Delete event
                  </Button>
                  <Typography variant="caption">
                    *Event pages cannot be restored once deleted.
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
