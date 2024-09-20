import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

async function loginUser(credentials) {
  return fetch("http://localhost:5000/clinic/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await loginUser({
      username,
      password,
    });
    console.log(response);
    if ("accessToken" in response) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      if (response.user.Role_ID === 1) {
        window.location.href = "/nurse_dashboard";
      } else if (response.user.Role_ID === 0) {
        window.location.href = "/doctor_dashboard";
      }
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
            bgcolor: "background.paper", // ใช้สีพื้นหลังมาตรฐานของ theme หรือสามารถกำหนดเป็น 'white'
            p: 3, // การเพิ่ม padding
            borderRadius: 2, // มนขอบ
            boxShadow: 1, // เพิ่มเงา เลือกจากเงาใน theme หรือใช้ '0 3px 5px rgba(0,0,0,0.1)'
            maxWidth: 400, // จำกัดความกว้างของกล่อง
            width: "100%", // ให้กล่องเต็มความกว้างที่กำหนด
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
