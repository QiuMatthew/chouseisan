import "./App.css";
import * as React from "react";
import "./App.css";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import {
  Alert,
  AppBar,
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Snackbar,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import logoIcon from "./images/chousei_logo.png";
export default function App() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          // position: "relative",
        }}
      >
        <CssBaseline />
        <AppBar position="relative" sx={{ backgroundColor: "#34a21a" }}>
          <Toolbar sx={{ width: 1000, margin: "0 auto" }}>
            <Link to="/">
              <img
                src={logoIcon}
                alt="Logo"
                height={45}
                style={{ marginRight: "12px" }}
              />
            </Link>
            <Box
              sx={{
                // color: "white",
                fontSize: 14,
                fontWeight: "bolder",
                fontFamily: "sans-serif",
                width: 200,
                margintop: 12,
              }}
            >
              <p style={{ margin: 0 }}>Host an event without hassle</p>
              <p style={{ margin: 0 }}>Esay scheduling!</p>
            </Box>
            <div
              style={{
                alignItems: "flex-start",
                backgroundColor: "white",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "row",
                fontSize: 14,
                overflow: "visible",
                padding: "5px 5px 5px 10px",
                position: "absolute",
                right: 20,
                top: 10,
                height: 44,
                justifyContent: "space-between ",
              }}
            >
              <p
                className="pr-p"
                style={{ color: "#666", margin: 0, width: 210 }}
              >
                Login is not required but it gives you more convenience!
              </p>
              <Button
                variant="contained"
                // size="small"
                // color="#f29700"
                sx={{
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                REGISTER/LOGIN
              </Button>
              <Button
                sx={{
                  // backgroundColor: "#ffffff",
                  borderRadius: 3,
                  color: "#34a21a",
                  textAlign: "center",
                  borderColor: "#34a21a",
                  border: "1px solid",
                  marginLeft: 1,
                }}
              >
                Notice
                <NotificationsNoneRoundedIcon />
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        {/* <Routes>
          <Route path="/" element={<InputForm />} />
        </Routes> */}
      </Box>
    </>
  );
}
