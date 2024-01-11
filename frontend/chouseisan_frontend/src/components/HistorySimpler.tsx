import { useState, useEffect, useContext } from "react";

import { ListItem, ListItemText, Button, Grid, Link } from "@mui/material";
import "./HistorySimpler.css";
import axios from "../utils/axios";
import { HistoryEventContext } from "../contexts/HistoryEvent";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
export default function HistorySimpler() {
  const { historyEvent, setHistoryEvent } = useContext(HistoryEventContext);
  const [title, setTitle] = useState<string[]>([]);
  const [timeslotList, setTimeslotsList] = useState<string[][]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    historyEvent.forEach((value) => {
      axios
        .get(`/event/timeslots/${value}`)
        .then((response) => {
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
    width: "465px",
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
  };
  // localStorage.clear();
  return (
    <div className="bg">
      <div className="history-simpler-container">
        <div className="header">
          Recently viewed events
          <p className="paragraph">Other users won't be able to see this</p>
        </div>
      </div>
      <div className="history-card">
        {title.slice(0, 2).map((value, index) => {
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
                navigate(`view_event/${historyEvent[index].replace(/-/g, "")}`);
              }}
            >
              <Grid container sx={{ height: "100%" }} spacing={1}>
                <Grid
                  item
                  xs={12}
                  sx={{ fontWeight: "bold", color: "black", fontSize: "18px" }}
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
                        maxWidth: "130px",
                      }}
                    >
                      <ListItemText
                        primary={`${timeslot}`}
                        primaryTypographyProps={{
                          style: {
                            padding: "1px",
                            maxWidth: `20ch`, // 设置最大宽度
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
      <Link
        href="/scheduler/history"
        color={"#a46702"}
        underline="hover"
        sx={{ marginBottom: "15px" }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 11 }} />
        View complete history
      </Link>
    </div>
  );
}
