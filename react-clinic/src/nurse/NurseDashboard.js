import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Calendar from "./Calendar"; // นำเข้า Calendar

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const PaperStyled2 = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  backgroundColor: "#4caf50",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const NumberBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#4caf50",
  borderRadius: "8px",
  padding: "5px 10px",
  fontWeight: "bold",
  fontSize: "1.5rem",
}));

const DividerBox = styled(Box)(({ theme }) => ({
  height: "50px",
  width: "2px",
  backgroundColor: "#fff",
}));

const AppointmentCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: "#4caf50",
  color: "#fff",
  borderRadius: "12px",
  marginTop: theme.spacing(2),
}));

const Dashboard = () => {
  const [newPatients, setNewPatients] = useState(0);
  const [oldPatients, setOldPatients] = useState(0);
  const [appointments, setAppointments] = useState([]); // เก็บข้อมูลนัดหมาย
  const [firstAppointment, setFirstAppointment] = useState(null); // เก็บนัดหมายรายการแรก

  useEffect(() => {
    fetchPatientCounts();
    fetchAppointments(); // เรียกใช้เพื่อดึงข้อมูลนัดหมายจาก appointmentqueue
  }, []);

  const fetchPatientCounts = async () => {
    try {
      const newResponse = await axios.get(
        "http://localhost:5000/api/new_patients"
      );
      const oldResponse = await axios.get(
        "http://localhost:5000/api/repeat_patients"
      );

      setNewPatients(newResponse.data.newPatients);
      setOldPatients(oldResponse.data.repeatPatients);
    } catch (error) {
      console.error("Error fetching patient counts:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointmentqueue");
      console.log(response.data); // ตรวจสอบข้อมูลที่ดึงมา
      setAppointments(response.data); // ควรจะเป็น array
    } catch (error) {
      console.error("Error fetching appointments from appointmentqueue:", error);
    }
  };
  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ContainerStyled maxWidth="lg">
        <PaperStyled>
          <Grid container spacing={2}>
            {/* กล่องผู้ป่วยใหม่และผู้ป่วยเก่า */}
            <Grid item xs={12} md={4}>
              <PaperStyled2>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" style={{ marginRight: "10px" }}>
                      ผู้ป่วยใหม่
                    </Typography>
                    <NumberBox>{newPatients}</NumberBox>
                  </Box>

                  <DividerBox />

                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" style={{ marginRight: "10px" }}>
                      ผู้ป่วยเก่า
                    </Typography>
                    <NumberBox>{oldPatients}</NumberBox>
                  </Box>
                </Box>
              </PaperStyled2>
            </Grid>

            {/* ปฏิทินที่ด้านขวา */}
            <Grid item xs={12} md={6}>
              <Box mt={4}>
                <Calendar appointments={appointments} />
              </Box>
            </Grid>
          </Grid>

          {/* เพิ่มส่วนแสดงการนัดหมาย */}
          <Box mt={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Updates</Typography>
              <Button href="/appointments">View All</Button>
            </Box>

            {firstAppointment ? (
              <AppointmentCard>
                <Box>
                  <img
                    src="/path/to/image.jpg"
                    alt="appointment"
                    style={{ width: "50px", marginRight: "10px" }}
                  />
                </Box>
                <Box>
                  <Typography variant="h6">{firstAppointment.title}</Typography>
                  <Typography>
                    {new Date(firstAppointment.Queue_Date).toLocaleDateString()} |{" "}
                    {new Date(firstAppointment.Queue_Time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              </AppointmentCard>
            ) : (
              <Typography>ไม่มีการนัดหมายในขณะนี้</Typography>
            )}
          </Box>
        </PaperStyled>
      </ContainerStyled>
    </Box>
  );
};

export default Dashboard;
