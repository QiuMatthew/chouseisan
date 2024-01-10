import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useContext,
} from "react";

import { List, ListItem, ListItemText, Button, Grid } from "@mui/material";
import "./HistorySimpler.css";
import axios from "../utils/axios";
import { HistoryEventContext } from "../contexts/HistoryEvent";

export default function HistorySimpler() {
  const { historyEvent, setHistoryEvent } = useContext(HistoryEventContext);
  const [title, setTitle] = useState<string[]>([]);
  const [timeslotList, setTimeslotsList] = useState<string[][]>([]);
  useEffect(() => {
    historyEvent.map((value, index) => {
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
  const dates: number[] = [1, 2, 3, 4, 5, 6];

  // 计算行数和列数
  const rows = Math.ceil(timeslotList.length / 3);
  const cols = Math.min(timeslotList.length, 3);
  return (
    <>
      <div className="history-simpler-container">
        <div className="header">
          Recently viewed events
          <p className="paragraph">Other users won't be able to see this</p>
        </div>
      </div>
      <div className="history-card">
        {title.slice(0, 2).map((value, index) => {
          console.log(timeslotList);
          console.log(title);
          return (
            <Button
              className="history-item"
              sx={{ ...buttonStyle, marginRight: "20px" }}
              variant="outlined"
            >
              <Grid container sx={{ height: "100%" }} spacing={1}>
                <Grid
                  item
                  xs={12}
                  sx={{ fontWeight: "bold", color: "black", fontSize: "18px" }}
                >
                  {value}
                </Grid>
                {timeslotList[index].map((timeslot, index) => (
                  <Grid item xs={4} key={index}>
                    <ListItem
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        "& .css-10hburv-MuiTypography-root": {
                          fontSize: "10px", // 调整字体大小
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
    </>
  );
}
