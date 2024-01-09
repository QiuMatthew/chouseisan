import { List, ListItem, ListItemText, Button, Grid } from "@mui/material";
import "./HistorySimpler.css";
export default function HistorySimpler() {
  const buttonStyle = {
    width: "465px",
    height: "165px",
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
  const rows = Math.ceil(dates.length / 3);
  const cols = Math.min(dates.length, 3);
  return (
    <>
      <div className="history-simpler-container">
        <div className="header">
          Recently viewed events
          <p className="paragraph">Other users won't be able to see this</p>
        </div>
      </div>
      <div className="history-card">
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
              Title
            </Grid>
            {dates.map((num, index) => (
              <Grid item xs={4} key={index}>
                <ListItem
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    "& .css-10hburv-MuiTypography-root": {
                      fontSize: "10px", // 调整字体大小
                      color: "black",
                    },

                    // padding: "3px",
                    width: "130px",
                  }}
                >
                  <ListItemText primary={`${num}`} sx={{ padding: "1px" }} />
                </ListItem>
              </Grid>
            ))}
          </Grid>
        </Button>

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
              Title
            </Grid>
            {dates.map((num, index) => (
              <Grid item xs={4} key={index}>
                <ListItem
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    "& .css-10hburv-MuiTypography-root": {
                      fontSize: "10px", // 调整字体大小
                      color: "black",
                    },

                    // padding: "3px",
                    width: "130px",
                  }}
                >
                  <ListItemText primary={`${num}`} sx={{ padding: "1px" }} />
                </ListItem>
              </Grid>
            ))}
          </Grid>
        </Button>
      </div>
    </>
  );
}
