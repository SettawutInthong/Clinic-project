import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { format } from "date-fns";
import Calendar from "./Calendar";
import LineChart from "./LineChart";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
}));

const PaperStyled2 = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  backgroundColor: "#508D4E",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const NumberBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#E4E0E1",
  color: "#508D4E",
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
const DividerBox2 = styled(Box)(({ theme }) => ({
  height: "50px",
  width: "2px",
  backgroundColor: "#B7B7B7",
}));

const AppointmentBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#508D4E",
  color: "#fff",
  borderRadius: "12px",
  padding: "10px",
  marginBottom: "10px",
}));

const MedicineBox = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#fff",
  borderRadius: "12px",
  padding: "10px",
  marginBottom: "10px",
}));

const FramBox = styled(Paper)(({ theme }) => ({
  backgroundColor: "#E4E0E1",
  color: "#fff",
  borderRadius: "12px",
  padding: "10px",
  marginBottom: "10px",
}));

const FramBox2 = styled(Paper)(({ theme }) => ({
  backgroundColor: "#508D4E",
  color: "#fff",
  borderRadius: "12px",
  padding: "10px",
  marginBottom: "10px",
}));

const Dashboard = () => {
  const [newPatients, setNewPatients] = useState(0);
  const [oldPatients, setOldPatients] = useState(0);
  const [todayAppointment, setTodayAppointment] = useState(null);
  const [allAppointments, setAllAppointments] = useState([]);
  const [viewAllPopup, setViewAllPopup] = useState(false);
  const [totalPatients, setTotalPatients] = useState(0);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);

  useEffect(() => {
    fetchPatientCounts();
    fetchTodayAppointment();
    fetchTotalPatients();
    fetchLowStockMedicines();
  }, []);

  const fetchLowStockMedicines = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/medicines/low_stock"
      );
      setLowStockMedicines(response.data);
    } catch (error) {
      console.error("Error fetching low stock medicines:", error);
    }
  };

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

  const fetchTodayAppointment = async () => {
    try {
      const todayDate = format(new Date(), "yyyy-MM-dd");
      const response = await axios.get(
        `http://localhost:5000/api/appointmentqueue/today?Queue_Date=${todayDate}`
      );

      if (response.data.length > 0) {
        setTodayAppointment(response.data[0]);
      } else {
        setTodayAppointment(null);
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/appointmentqueue"
      );
      setAllAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching all appointments:", error);
    }
  };

  const handleViewAllClick = () => {
    fetchAllAppointments();
    setViewAllPopup(true);
  };

  const handleCloseDialog = () => {
    setViewAllPopup(false);
  };

  const fetchTotalPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/patients/total"
      );
      setTotalPatients(response.data.total);
    } catch (error) {
      console.error("Error fetching total patients:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ContainerStyled maxWidth="lg">
        <PaperStyled>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}></Grid>
                <Grid item xs={12} sm={6}>
                  <FramBox>
                    <Box flexDirection="column" alignItems="center" mt={0}>
                      <Typography color="#000" variant="h6" >
                        ปฏิทิน
                      </Typography>
                      <Calendar />
                    </Box>
                  </FramBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FramBox>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      mt={0}
                    >
                      <Typography variant="h6" color="#000">
                        ยอดผู้ป่วยวันนี้
                      </Typography>
                      <Box width={180} height={190} my={3}>
                        <CircularProgressbar
                          value={newPatients + oldPatients}
                          maxValue={totalPatients}
                          text={`${newPatients + oldPatients}`}
                          styles={buildStyles({
                            textColor: "#000",
                            pathColor: "#4CAF50",
                            trailColor: "#B7B7B7",
                          })}
                        />
                      </Box>
                  
                      <Box mt={2} display="flex" alignItems="center">
                        <Box
                          width={30}
                          height={30}
                          
                          borderRadius="50%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="#fff"
                          mr={1}
                        >
                          😊
                        </Box>
                        <Typography color="#000">
                          วันนี้: {newPatients + oldPatients} / ทั้งหมด:{" "}
                          {totalPatients}
                        </Typography>
                      </Box>
                    </Box>
                  </FramBox>
                </Grid>
                <Grid item xs={12} md={12}>
                  <FramBox style={{ height: "105px" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box display="flex" alignItems="center" color="#000">
                        <Typography variant="h6">ผู้ป่วยนัดวันนี้</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Button color="primary" onClick={handleViewAllClick}>
                          View All
                        </Button>
                      </Box>
                    </Box>
                    {todayAppointment ? (
                      <AppointmentBox>
                        <Typography variant="body1">
                          {`${todayAppointment.HN} - ${todayAppointment.First_Name} ${todayAppointment.Last_Name}`}
                        </Typography>
                        <Typography variant="body2">
                          {format(
                            new Date(todayAppointment.Queue_Date),
                            "dd MMM, yyyy"
                          )}{" "}
                          |{" "}
                          {format(
                            new Date(
                              `1970-01-01T${todayAppointment.Queue_Time}`
                            ),
                            "hh:mm a"
                          )}
                        </Typography>
                      </AppointmentBox>
                    ) : (
                      <Typography color="#000">-</Typography>
                    )}
                  </FramBox>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid item xs={12} md={12}>
                <FramBox>
                  <Box flexDirection="column" alignItems="center" mt={0}>
                    <LineChart />
                  </Box>
                </FramBox>
              </Grid>
              <Grid item xs={12} md={12}>
                <FramBox2 style={{ height: "255px" }}>
          
                  <Typography variant="h6">รายการยาที่ต้องเติม</Typography>

               
                  <Box style={{ height: "200px", overflowY: "auto" }}>
                    {lowStockMedicines.map((medicine, index) => (
                      <MedicineBox key={index}>
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="flex-start" 
                          width="100%"
                        >
                          <Typography variant="body1" color="#000">
                            {medicine.Medicine_Name}
                          </Typography>

                          
                          <Box
                            display="flex"
                            alignItems="center"
                            marginLeft={2}
                          >
                            <DividerBox2 />
                            <Typography
                              variant="body1"
                              color="#000"
                              marginLeft={1}
                            >
                              คงเหลือ: {medicine.Quantity}
                            </Typography>
                          </Box>
                        </Box>
                      </MedicineBox>
                    ))}
                  </Box>
                </FramBox2>
              </Grid>
            </Grid>
          </Grid>

          <Dialog
            open={viewAllPopup}
            onClose={handleCloseDialog}
            aria-labelledby="view-all-appointments-title"
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle id="view-all-appointments-title">
              ผู้ป่วยนัดหมายทั้งหมด
            </DialogTitle>
            <DialogContent dividers>
              {allAppointments.length > 0 ? (
                allAppointments.map((appointment, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography variant="body1">{`${appointment.HN} - ${appointment.First_Name} ${appointment.Last_Name}`}</Typography>
                    <Typography variant="body2">
                      {new Date(appointment.Queue_Date).toLocaleDateString()} |{" "}
                      {new Date(
                        `1970-01-01T${appointment.Queue_Time}`
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>ไม่มีนัดหมาย</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                ปิด
              </Button>
            </DialogActions>
          </Dialog>
        </PaperStyled>
      </ContainerStyled>
    </Box>
  );
};

export default Dashboard;
