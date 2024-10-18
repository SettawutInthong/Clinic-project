import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios"; // ใช้ axios เพื่อเรียก API

async function loginUser(credentials) {
  return fetch("http://localhost:5000/clinic/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

// ฟังก์ชันสำหรับลบคิวที่ไม่ใช่ผู้ป่วยใหม่
const deleteOldQueue = async () => {
  try {
    await axios.delete("http://localhost:5000/api/remove_old_queue");
    console.log("ลบคิวที่ไม่ใช่ผู้ป่วยใหม่สำเร็จ");
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบคิว:", error);
  }
};

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const response = await loginUser({
      username,
      password,
    });

    if ("accessToken" in response) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      // ลบคิวเมื่อเข้าสู่ระบบสำเร็จ
      await deleteOldQueue(); // เรียกใช้ฟังก์ชันลบคิว

      // ตรวจสอบ Role_ID เพื่อนำทางไปยังหน้า dashboard
      if (response.user.Role_ID === 1) {
        window.location.href = "/nurse_dashboard";
      } else if (response.user.Role_ID === 0) {
        window.location.href = "/doctor_dashboard";
      }
    } else {
      console.error("เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <div className="bg">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 1,
            maxWidth: 400,
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h5">
            คลินิกรุ่งเรือง
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(event) => setUsername(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              เข้าสู่ระบบ
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
