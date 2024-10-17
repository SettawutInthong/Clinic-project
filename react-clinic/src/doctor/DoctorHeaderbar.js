import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/+.png";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const pages = [
  { title: "หน้าแรก", icon: "", to: "/doctor_dashboard" },
  { title: "รายชื่อผู้ป่วย", icon: "", to: "/doctor_patient" },
  { title: "คิว", icon: "", to: "/doctor_queue" },
  { title: "รายการยา", icon: "", to: "/doctor_meddetail" },
];

function DoctorHeader() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuItemClick = async (to) => {
    if (to === "/doctor__queue") {
      await deleteOldHNFromQueue(); // ลบข้อมูลก่อนเปลี่ยนหน้า
    }
    navigate(to);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  const deleteOldHNFromQueue = async () => {
    try {
      await axios.delete("http://localhost:5000/api/remove_old_queue");
      console.log("ลบคิวที่ไม่ใช่ผู้ป่วยใหม่สำเร็จ");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบคิว:", error);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1A5319" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            sx={{
              height: 32,
              width: 32,
              display: { xs: "none", md: "flex" },
              mr: 1,
            }}
            alt="Logo"
            src={logo}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            คลินิกรุ่งเรือง
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={() => handleMenuItemClick(page.to)}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            component="img"
            sx={{
              height: 32,
              width: 32,
              display: { xs: "flex", md: "none" },
              mr: 1,
              mx: "auto",
            }}
            alt="Logo"
            src={logo}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              mx: "auto",
            }}
          >
            คลินิกรุ่งเรือง
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => handleMenuItemClick(page.to)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Button
              variant="contained"
              type="submit"
              style={{ height: "30px" }}
              color="error"
              onClick={handleLogout}
            >
              <IconButton>
                <LogoutIcon />
              </IconButton>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default DoctorHeader;
