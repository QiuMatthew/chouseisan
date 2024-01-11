import axios from "../utils/axios";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useContext,
} from "react";
import {
  Routes,
  Route,
  Link as Link2,
  useNavigate,
  useLocation,
  useParams,
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
import { makeStyles } from "@mui/material";
import topIcon from "../images/top.png";
import FlagIcon from "@mui/icons-material/Flag";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers";
import * as timezone from "dayjs/plugin/timezone";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
  GridClasses,
} from "@mui/x-data-grid";
import DateProposalGrid from "./DateProposalGrid";
import { authAxios } from "../utils/axios";
import { timeslots } from "../types/Event";
import Nonexist from "./Nonexist";
import { HistoryEventContext } from "../contexts/HistoryEvent";

import "./History.css";
export default function History() {
  const { historyEvent, setHistoryEvent } = useContext(HistoryEventContext);
  const [title, setTitle] = useState<string[]>([]);
  const [timeslotList, setTimeslotsList] = useState<string[][]>([]);
  const navigate = useNavigate();
  console.log(historyEvent);
  useEffect(() => {
    historyEvent.map((value, index) => {
      axios
        .get(`/event/timeslots/${value}`)
        .then((response) => {
          console.log(response.data);
          setTitle((title) => {
            if (title.includes(response.data.title)) return title;
            else return [...title, response.data.title];
          });
          setTimeslotsList((timeslotList) => {
            if (
              timeslotList.some(
                (value) =>
                  JSON.stringify(value) ===
                  JSON.stringify(Object.values(response.data.timeslots))
              )
            )
              return timeslotList;
            else
              return [...timeslotList, Object.values(response.data.timeslots)];
          });
        })
        .catch((error) => {
          console.log(error);
          console.log("ERROR connecting backend service");
        });
    });
  }, []);
  const buttonStyle = {
    width: "700px",
    height: "180px",
    border: "1px solid #ccc",
    "&:hover": {
      backgroundColor: "#f8f6e3",
      border: "1px solid #ccc",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30px",
  };
  return (
    <>
      <div className="topBox">
        <p className="first">
          <Link
            href="/scheduler"
            color={"#a46702"}
            underline="hover"
            sx={{ marginBottom: "5px" }}
          >
            Top
          </Link>
          {" > "}Recently viewed events
        </p>
        <h1>Recently viewed events</h1>
      </div>
      <div style={{ backgroundColor: "#f1f1f1e6" }}>
        <div className="bottomBox">
          <Button
            className="history-item"
            disabled
            sx={{
              ...buttonStyle,
              marginRight: "20px",
              backgroundColor: "#fff",
              height: "50px",
              color: "green",
              fontWeight: "600",
              "&.Mui-disabled": { color: "green" },
            }}
            variant="outlined"
          >
            Upto 5 most recent events are displayed here.
          </Button>
          {title.slice(0, 5).map((value, index) => {
            // console.log(timeslotList);
            // console.log(title);
            return (
              <Button
                className="history-item"
                sx={{
                  ...buttonStyle,
                  marginRight: "20px",
                  backgroundColor: "#fff",
                }}
                variant="outlined"
                onClick={() => {
                  console.log("clicked");
                  navigate(
                    `../view_event/${historyEvent[index].replace(/-/g, "")}`
                  );
                }}
              >
                <Grid container sx={{ height: "100%" }} spacing={1}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "18px",
                    }}
                  >
                    {value}
                  </Grid>
                  {timeslotList[index].slice(0, 6).map((timeslot, index) => (
                    <Grid item xs={4} key={index}>
                      <ListItem
                        sx={{
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          "& .css-10hburv-MuiTypography-root": {
                            fontSize: "12px", // 调整字体大小
                            color: "black",
                          },
                          maxWidth: "200px",
                        }}
                      >
                        <ListItemText
                          primary={`${timeslot}`}
                          primaryTypographyProps={{
                            style: {
                              padding: "1px",
                              maxWidth: `40ch`, // 设置最大宽度
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      </ListItem>
                    </Grid>
                  ))}
                </Grid>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}
