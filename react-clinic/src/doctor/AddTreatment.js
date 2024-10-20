import React, { useState, useEffect } from "react";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Paper,
  Switch,
  TextField,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TreatmentHistory from "./TreatmentHistory";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  DateTimePicker,
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { setHours, setMinutes } from "date-fns";

const AddTreatment = () => {
  const { HN } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [diseaseName, setDiseaseName] = useState("");
  const [allergyDetails, setAllergyDetails] = useState("");
  const [treatmentData, setTreatmentData] = useState({
    Heart_Rate: "",
    Pressure: "",
    Temp: "",
    Height: "",
    Weight: "",
    Symptom: "",
    Treatment_Detail: "",
    Treatment_Others: "",
    Pregnancy_Control_Type: "",
    Last_Control_Date: null,
    Freq_Pregnancies: "",
    Pregnancy_Problems: "",
    Total_Pregnancies: "",
    Total_Children: "",
    Last_Pregnancy_Date: null,
    Abortion_History: "",
    Pregmed_Detail: "",
    Preg_Others: ""
  });
  const [treatmentType, setTreatmentType] = useState("");
  const [historyPopupOpen, setHistoryPopupOpen] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [isContraceptionVisible, setContraceptionVisible] = useState(false);
  const [isPregnancyVisible, setPregnancyVisible] = useState(false);
  const [appointmentPopup, setAppointmentPopup] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const navigate = useNavigate();

  const handleOpenAppointmentPopup = () => {
    setAppointmentPopup(true);
  };

  const handleCloseAppointmentPopup = () => {
    setAppointmentPopup(false);
  };

  const handleOpenHistoryPopup = () => {
    setHistoryPopupOpen(true);
  };

  const handleCloseHistoryPopup = () => {
    setHistoryPopupOpen(false);
  };

  const handleSubmitGeneralTreatment = async () => {
    try {
      const data = {
        HN: HN,
        Treatment_Detail: treatmentData.Treatment_Detail || "N/A",
        General_Details: treatmentData.General_Details || "N/A",
        Treatment_Others: treatmentData.Treatment_Others || "N/A",
      };
  
      console.log("Data being sent: ", data);
  
      const response = await axios.post("http://localhost:5000/api/general_treatment", data);
      alert("บันทึกข้อมูลสำเร็จ!");
      navigate(`/doctor_addorder/${HN}`);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + (error.response?.data?.error || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"));
    }
  };  
  


  const handleSubmitPregnancyTreatment = async () => {
    try {
      const data = {
        HN: HN,
        Pregnancy_Control_Type: treatmentData.Pregnancy_Control_Type,
        Last_Control_Date: treatmentData.Last_Control_Date,
        Freq_Pregnancies: treatmentData.Freq_Pregnancies,
        Pregnancy_Problems: treatmentData.Pregnancy_Problems,
        Total_Pregnancies: treatmentData.Total_Pregnancies,
        Total_Children: treatmentData.Total_Children,
        Last_Pregnancy_Date: treatmentData.Last_Pregnancy_Date,
        Abortion_History: treatmentData.Abortion_History,
        Pregmed_Detail: treatmentData.Pregmed_Detail,
        Preg_Others: treatmentData.Preg_Others,
      };

      const response = await axios.post("http://localhost:5000/api/pregnancy_treatment", data);
      alert("บันทึกข้อมูลสำเร็จ!");
      navigate(`/doctor_addorder/${HN}`);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + (error.response?.data?.error || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"));
    }
  };

  const ConfirmAppointment = async () => {
    if (!HN || !appointmentDate) {
      console.error("กรุณาเลือกวันที่นัดหมาย");
      return;
    }

    try {
      const date = appointmentDate.toISOString().split("T")[0];
      const time = appointmentDate.toLocaleTimeString("it-IT");

      await axios.post(`http://localhost:5000/api/appointments`, {
        HN,
        Queue_Date: date,
        Queue_Time: time,
      });

      console.log("บันทึกการนัดหมายสำเร็จ");
      handleCloseAppointmentPopup();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกการนัดหมาย:", error);
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/patient/${HN}`
        );
        const patient = response.data.data[0];
        setPatientData(patient);

        if (patient.Disease_ID) {
          const diseaseResponse = await axios.get(
            `http://localhost:5000/api/disease/${patient.Disease_ID}`
          );
          setDiseaseName(diseaseResponse.data.diseaseName);
        }

        if (patient.Allergy_ID) {
          const allergyResponse = await axios.get(
            `http://localhost:5000/api/allergy/${patient.Allergy_ID}`
          );
          setAllergyDetails(allergyResponse.data.allergyDetails);
        }

        const treatmentResponse = await axios.get(
          `http://localhost:5000/api/treatment/${HN}/latest`
        );
        if (treatmentResponse.data.data) {
          setTreatmentData(treatmentResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [HN]);

  const renderTreatmentForm = () => {
    if (treatmentType === "ทั่วไป") {
      return (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenHistoryPopup}
          >
            ดูประวัติการรักษา
          </Button>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                1. การรักษา
              </Typography>
            </Grid>
            <TextField
              label="การวินิจฉัยเบื้องต้น"
              fullWidth
              margin="dense"
              multiline
              size="small"
              value={treatmentData.General_Details || ""}  // ตรวจสอบและตั้งค่าให้ไม่เป็น undefined
              onChange={(e) => setTreatmentData({ ...treatmentData, General_Details: e.target.value })}
            />

            <TextField
              label="รายละเอียดการรักษา"
              fullWidth
              margin="dense"
              multiline
              rows={10}
              value={treatmentData.Treatment_Detail || ""}  // ตรวจสอบและตั้งค่าให้ไม่เป็น undefined
              onChange={(e) => setTreatmentData({ ...treatmentData, Treatment_Detail: e.target.value })}
            />
            <Button variant="outlined" onClick={handleOpenAppointmentPopup}>
              นัดหมายผู้ป่วย
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              2. บันทึกเพิ่มเติม
            </Typography>
          </Grid>
          <TextField
            label="บันทึกเพิ่มเติม"
            fullWidth
            margin="dense"
            size="small"
            multiline
            rows={5}
            value={treatmentData.Treatment_Others || ""}  // ตรวจสอบและตั้งค่าให้ไม่เป็น undefined
              onChange={(e) => setTreatmentData({ ...treatmentData, Treatment_Others: e.target.value })}
          />
        </>
      );
    } else if (treatmentType === "ฉีดยาคุม") {
      return (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenHistoryPopup}
          >
            ดูประวัติการรักษา
          </Button>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  1. ประวัติการคุมกำเนิด
                </Typography>
                <Switch
                  checked={isContraceptionVisible}
                  onChange={() =>
                    setContraceptionVisible(!isContraceptionVisible)
                  }
                />
              </Grid>
              {isContraceptionVisible && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel>ประเภทของการคุมกำเนิด</InputLabel>
                      <Select
                        defaultValue=""
                        label="ประเภทของการคุมกำเนิด"
                        onChange={(e) => setTreatmentData({ ...treatmentData, Pregnancy_Control_Type: e.target.value })}
                      >
                        <MenuItem value="ยาคุมกำเนิด">ยาคุมกำเนิด</MenuItem>
                        <MenuItem value="ฉีดยาคุม">ฉีดยาคุม</MenuItem>
                        <MenuItem value="ใส่ห่วงอนามัย">ใส่ห่วงอนามัย</MenuItem>
                      </Select>
                    </FormControl>

                    <DatePicker
                      label="วันที่ฉีดครั้งล่าสุด"
                      inputFormat="dd/MM/yyyy"
                      value={treatmentData.Last_Control_Date}
                      onChange={(date) => setTreatmentData({ ...treatmentData, Last_Control_Date: date })}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "dense",
                          size: "small",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>

                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel>ความถี่ในการฉีดยาคุมกำเนิด</InputLabel>
                      <Select
                        defaultValue=""
                        label="ความถี่ในการฉีดยาคุมกำเนิด"
                        onChange={(e) => setTreatmentData({ ...treatmentData, Freq_Pregnancies: e.target.value })}
                      >
                        <MenuItem value="1 เดือนครั้ง">1 เดือนครั้ง</MenuItem>
                        <MenuItem value="3 เดือนครั้ง">3 เดือนครั้ง</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="ปัญหาหรืออาการข้างเคียงจากการใช้ยาคุม"
                      fullWidth
                      margin="dense"
                      size="small"
                      multiline
                      rows={3}
                      onChange={(e) => setTreatmentData({ ...treatmentData, Pregnancy_Problems: e.target.value })}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  2. ประวัติการตั้งครรภ์และการมีบุตร
                </Typography>
                <Switch
                  checked={isPregnancyVisible}
                  onChange={() => setPregnancyVisible(!isPregnancyVisible)}
                />
              </Grid>
              {isPregnancyVisible && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="จำนวนการตั้งครรภ์ที่เคยมี"
                      fullWidth
                      margin="dense"
                      size="small"
                      type="number"
                      onChange={(e) => setTreatmentData({ ...treatmentData, Total_Pregnancies: e.target.value })}
                    />

                    <TextField
                      label="จำนวนการคลอดบุตร"
                      fullWidth
                      margin="dense"
                      size="small"
                      type="number"
                      onChange={(e) => setTreatmentData({ ...treatmentData, Total_Children: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="การตั้งครรภ์ล่าสุด (ถ้ามี)"
                      inputFormat="dd/MM/yyyy"
                      value={treatmentData.Last_Pregnancy_Date}
                      onChange={(date) => setTreatmentData({ ...treatmentData, Last_Pregnancy_Date: date })}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "dense",
                          size: "small",
                        },
                      }}
                    />

                    <TextField
                      label="การแท้งบุตรหรือการตั้งครรภ์นอกมดลูก (ถ้ามี)"
                      fullWidth
                      margin="dense"
                      size="small"
                      onChange={(e) => setTreatmentData({ ...treatmentData, Abortion_History: e.target.value })}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  3. รายละเอียดการรักษา
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="ชนิดของยาคุมกำเนิดที่ฉีด"
                  fullWidth
                  margin="dense"
                  size="small"
                  onChange={(e) => setTreatmentData({ ...treatmentData, Pregmed_Detail: e.target.value })}
                />

                
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="จำนวนยา"
                  fullWidth
                  margin="dense"
                  size="small"
                  onChange={(e) => setTreatmentData({ ...treatmentData, Pregmed_Detail: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  4. บันทึกเพิ่มเติม
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" onClick={handleOpenAppointmentPopup}>
                  นัดหมายผู้ป่วย
                </Button>
                <TextField
                  label="บันทึกเพิ่มเติม"
                  fullWidth
                  margin="dense"
                  size="small"
                  multiline
                  rows={5}
                  onChange={(e) => setTreatmentData({ ...treatmentData, Preg_Others: e.target.value })}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </>
      );
    }
  };

  useEffect(() => {
    if (historyPopupOpen) {
      const fetchTreatmentHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/treatment/${HN}/history`
          );
          setTreatmentHistory(response.data.data);
        } catch (error) {
          console.error("Error fetching treatment history:", error);
        }
      };
      fetchTreatmentHistory();
    }
  }, [historyPopupOpen, HN]);

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        {patientData ? (
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} style={{ marginTop: "20px" }}>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ flexGrow: 1, textAlign: "center" }}
                  >
                    การรักษา - {treatmentData.Treatment_ID}
                  </Typography>
                </Grid>
                <FormControl fullWidth size="small">
                  <InputLabel id="treatment-type-label" size="small">
                    ประเภทการรักษา
                  </InputLabel>
                  <Select
                    labelId="treatment-type-label"
                    id="treatment-type"
                    value={treatmentType}
                    label="ประเภทการรักษา"
                    onChange={(e) => setTreatmentType(e.target.value)}
                  >
                    <MenuItem value="ทั่วไป">การรักษาทั่วไป</MenuItem>
                    <MenuItem value="ฉีดยาคุม">การคุมกำเนิด</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} style={{ marginTop: "20px" }}>
                {renderTreatmentForm()}
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Button
                    variant="outlined"
                    style={{
                      color: "#1976d2",
                      borderColor: "#1976d2",
                      textTransform: "none",
                      marginRight: "10px",
                    }}
                    onClick={() => navigate(`/doctor_treatmenthistory/${patientData.HN}`)}
                  >
                    กลับ
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      if (treatmentType === "ทั่วไป") {
                        handleSubmitGeneralTreatment();
                      } else if (treatmentType === "ฉีดยาคุม") {
                        handleSubmitPregnancyTreatment();
                      }
                    }}
                  >
                    บันทึกการรักษา
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        ) : (
          <p>ไม่พบข้อมูลผู้ป่วย</p>
        )}

        <Dialog
          open={appointmentPopup}
          onClose={handleCloseAppointmentPopup}
          aria-labelledby="appointment-dialog-title"
          maxWidth="sm"
          fullWidth
          sx={{ "& .MuiDialog-paper": { minHeight: "80vh" } }}
        >
          <DialogTitle
            id="appointment-dialog-title"
            style={{ flexGrow: 1, textAlign: "center" }}
          >
            นัดหมายผู้ป่วย
          </DialogTitle>
          <DialogContent sx={{ minHeight: "70vh" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="เลือกวันที่และเวลา"
                value={appointmentDate}
                onChange={(date) => setAppointmentDate(date)}
                ampm={false}
                minTime={setHours(setMinutes(new Date(), 0), 8)}
                maxTime={setHours(setMinutes(new Date(), 0), 20)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "dense",
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAppointmentPopup} color="primary">
              ยกเลิก
            </Button>
            <Button onClick={ConfirmAppointment} color="primary">
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={historyPopupOpen}
          onClose={handleCloseHistoryPopup}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>ประวัติการรักษา</DialogTitle>
          <DialogContent>
            <TreatmentHistory HN={HN} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseHistoryPopup} color="primary">
              ปิด
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default AddTreatment;