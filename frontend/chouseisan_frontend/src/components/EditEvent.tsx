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
import "./EditEvent.css";

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

export default function EditEvent() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [no, setNo] = useState(0);
  const japanTime = dayjs();
  const [dateList, setDateList] = useState("");
  const navigate = useNavigate();

  const eventSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`/edit`, {
        title: title,
        detail: detail,
        dateList: dateList,
      })
      .then(function (response) {
        navigate("/create_complete");
      })
      .catch(function (response) {
        console.log("ERROR connecting backend service");
      });
  };

  const columns = [
    {
      field: "column1",
      headerName: "",
      height: 0.1,
      width: 300,
      sortable: false,
      cellClassName: "grayGray",
    },
    {
      field: "column2",
      headerName: "",
      height: 0.1,
      width: 1500,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => renderColumn2(params),
    },
  ];

  const rows = [
    { id: 1, column1: "Event Name", column2: "" },
    { id: 2, column1: "Event Detail", column2: "" },
    { id: 3, column1: "Proposal Date", column2: "" },
  ];

  function App() {
    return (
      <form className="container" onSubmit={eventSubmit}>
        <div style={{ height: 900, width: "100%", margin: "10px" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            disableColumnSelector
            className="no-header"
            getRowHeight={() => "auto"}
          />
        </div>
      </form>
    );
  }

  function renderColumn2(params: GridRenderCellParams) {
    // rowIdに基づいて適切な関数を選択して表示
    const rowId = params.id;
    switch (rowId) {
      case 1:
        return aaa();
      case 2:
        return iii();
      case 3:
        return uuu();
      default:
        return null;
    }
  }

  function iii() {
    return (
      <div style={{ height: "auto", fontFamily: "Arial" }}>
        <textarea
          defaultValue={detail}
          style={{ margin: "10px", fontFamily: "Arial" }}
        />
      </div>
    );
  }

  function uuu() {
    return (
      <>
        <div className="box2">
          <div className="event-box">
            <p className="item-title">
              <span className="step-label">STEP2</span>Date/Time Proposals
            </p>
            <p className="item-description">
              List the dates and corresponding times propose to host an event.
              <br></br>*Input one proposal per line.
            </p>
            <p className="item-description">
              Example:<br></br>　Aug 7(Mon) 20:00～<br></br>　Aug 8(Tue) 20:00～
              <br></br>　Aug 9(Wed) 21:00～
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
                  console.log(dateList);
                  return dateList;
                });
              }}
            />
          </LocalizationProvider>
        </div>
      </>
    );
  }

  function aaa() {
    return (
      <div>
        <input
          type="text"
          defaultValue={title}
          style={{ margin: "10px", fontFamily: "Arial" }}
        />
      </div>
    );
  }

  // // a_listが与えられたと仮定
  // const a_list = ["2023-12-20", "2023-12-25", "2023-12-31"];

  // // a_listをdateListに結合するコード
  // setDateList((dateList) => {
  //   // 先ほどのコードで生成された日付情報
  //   const newDateList = dateList || ""; // もしDateListがnullやundefinedなら空文字列として扱う

  //   // a_listから新しい日付情報を生成
  //   const newDateListFromAList = a_list
  //     .map((date) => {
  //       const japanTime = dayjs(date).add(9, "hour").toString();
  //       return `${japanTime.slice(8, 11)} ${japanTime.slice(5, 7)}(${japanTime.slice(0, 3)}) ${japanTime.slice(17, 22)}～`;
  //     })
  //     .join("\n");

  //   // 既存の日付情報と新しい日付情報を結合
  //   const combinedDateList = `${newDateList}\n${newDateListFromAList}`;
  //   dateList = combinedDateList;

  //   console.log(combinedDateList); // コンソールに結合された日付情報を表示（必要に応じて）

  //   return dateList;
  // });

  React.useEffect(() => {
    axios
      .get("/isCreatedBySelf")
      .then((response) => {
        setTitle(response.data.title);
        setDetail(response.data.detail);
        //setDateList(Array(response.data.proposals.length).fill(undefined));//response.data.scheduleLIstというスケジュールリストを使って，リストを生成する関数？？
      })
      .catch((reason) => {
        console.log(reason);
        console.log("ERROR connecting backend service");
      });
  }, []);

  return (
    <>
      <p className="firstLink">
        <Link
          href="/scheduler/view_event"
          color={"#a46702"}
          underline="hover"
          sx={{ marginBottom: "15px" }}
        >
          {name}
        </Link>
        {" > "}Edit/Delete Event
      </p>
      <div className="container1">
        <div className="event-header">Edit/Delete Event</div>

        <p style={{ backgroundColor: "#eaf4e5" }}>
          <App />
        </p>

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
      {/* <Box sx={{ background: "#f9f9f9" }}>
        <div className="container2">
          <p className="event-detail">Date Proposals</p>
          <p>Click on the name to edit your response.</p>
          <DateProposalGrid />
        </div>
      </Box> */}
    </>
  );
}
