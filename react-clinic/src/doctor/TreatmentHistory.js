import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
  Grid,
  ButtonGroup,
  DialogActions,
  Divider
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from "react-router-dom";

const TreatmentHistory = () => {
  const { HN } = useParams();
  const [treatments, setTreatments] = useState([]);
  const [selectedGeneralTreatment, setSelectedGeneralTreatment] = useState(null);
  const [selectedPregnancyTreatment, setSelectedPregnancyTreatment] = useState(null);
  const [dialogState, setDialogState] = useState({
    open: false,
    selectedOrder: [],
  });
  const [patientTitle, setPatientTitle] = useState(""); // เก็บคำนำหน้าชื่อผู้ป่วย
  const navigate = useNavigate();

  // ดึงข้อมูลการรักษาจาก backend
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        // ดึงข้อมูลผู้ป่วยเพื่อตรวจสอบคำนำหน้าชื่อ
        const patientResponse = await axios.get(`http://localhost:5000/api/patient/${HN}`);
        const patientData = patientResponse.data.data;
        console.log("ข้อมูลผู้ป่วย: ", patientData); // เพิ่ม log เพื่อตรวจสอบข้อมูลผู้ป่วย
        setPatientTitle(patientData.Title); // เก็บคำนำหน้าผู้ป่วย

        // ดึงข้อมูลประวัติการรักษา
        const response = await axios.get(`http://localhost:5000/api/treatments/${HN}`);
        console.log("ข้อมูลประวัติการรักษา: ", response.data.data); // เพิ่ม log เพื่อตรวจสอบข้อมูลการรักษา
        setTreatments(response.data.data || []);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการรักษา:", error);
      }
    };
    fetchTreatments();
  }, [HN]);


  const getTreatmentType = (treatment) => {
    const hasGeneralTreatment = treatment.GeneralTreatmentID ? "รักษาทั่วไป" : "";
    const hasPregnancyTreatment = treatment.PregnancyTreatmentID ? "รักษาการตั้งครรภ์" : "";
    const hasMedicineOrder = treatment.Order_ID ? "จ่ายยา" : "";

    // รวมประเภทการรักษาที่มี
    const treatmentTypes = [hasGeneralTreatment, hasPregnancyTreatment, hasMedicineOrder]
      .filter(Boolean)
      .join(", ");

    return treatmentTypes || "ไม่มีข้อมูลการรักษา";
  };

  const handleOpenGeneralTreatment = async (generalTreatmentID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/general_treatment/${generalTreatmentID}`);
      setSelectedGeneralTreatment(response.data.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการรักษาทั่วไป:", error);
    }
  };

  const handleCloseGeneralTreatment = () => {
    setSelectedGeneralTreatment(null);
  };

  const handleOpenPregnancyTreatment = async (pregnancyTreatmentID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pregnancy_treatment/${pregnancyTreatmentID}`);
      setSelectedPregnancyTreatment(response.data.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการรักษาการตั้งครรภ์:", error);
    }
  };

  const handleClosePregnancyTreatment = () => {
    setSelectedPregnancyTreatment(null);
  };

  const handleOpenOrderDetails = async (orderID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/medicine_details?Order_ID=${orderID}`);
      setDialogState({ open: true, selectedOrder: response.data.data || [] });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์:", error);
      setDialogState({ open: true, selectedOrder: [] });
    }
  };

  const handleCloseOrderDetails = () => {
    setDialogState({ open: false, selectedOrder: [] });
  };

  const isFemaleTitle = () => {
    return ["นาง", "นางสาว"].includes(patientTitle); // Checks if the title indicates female
  };


  return (
    <Paper sx={{ padding: 3, margin: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ButtonGroup variant="outlined" color="primary">
          <Button onClick={() => navigate(`/doctor_patientdetail/${HN}`)}><PlayArrowIcon style={{ transform: "rotate(180deg)" }} /> ไปยังประวัติผู้ป่วย</Button>
          <Button onClick={() => navigate(`/doctor_addtreatment/${HN}`)}>ไปยังบันทึกการรักษา<PlayArrowIcon /></Button>
          <Button onClick={() => navigate(`/doctor_addorder/${HN}`)}>ไปยังรายการจ่ายยา<PlayArrowIcon /><PlayArrowIcon /></Button>
        </ButtonGroup>
      </Box>
      <Typography variant="h6" gutterBottom>
        ประวัติการรักษา
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>วันที่รักษา</TableCell>
              <TableCell align="center">ประเภทการรักษา</TableCell>
              <TableCell align="center">รายการจ่ายยา</TableCell>
              <TableCell align="center">การรักษาทั่วไป</TableCell>

              {/* Conditionally render header for pregnancy treatment if any treatment has a PregnancyTreatmentID */}
              {treatments.some((treatment) => treatment.PregnancyTreatmentID) && (
                <TableCell align="center">การรักษาผดุงครรภ์</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {treatments.length > 0 ? (
              treatments.map((treatment) => (
                <TableRow key={treatment.Treatment_ID}>
                  <TableCell>{new Date(treatment.Treatment_Date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{getTreatmentType(treatment)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenOrderDetails(treatment.Order_ID)}
                    >
                      ดูรายการจ่ายยา
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={!treatment.GeneralTreatmentID}
                      onClick={() => handleOpenGeneralTreatment(treatment.GeneralTreatmentID)}
                    >
                      {treatment.GeneralTreatmentID ? "ดูการรักษาทั่วไป" : "ไม่มีการรักษาทั่วไป"}
                    </Button>
                  </TableCell>

                  {/* Conditionally render cell for pregnancy treatment if the treatment has PregnancyTreatmentID */}
                  {treatments.some((treatment) => treatment.PregnancyTreatmentID) && (
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        disabled={!treatment.PregnancyTreatmentID}
                        onClick={() => handleOpenPregnancyTreatment(treatment.PregnancyTreatmentID)}
                      >
                        {treatment.PregnancyTreatmentID ? "ดูการรักษาการผดุงครรภ์" : "ไม่มีการรักษาการผดุงครรภ์"}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  ไม่มีข้อมูลการรักษา
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup แสดงรายละเอียดออเดอร์ */}
      <Dialog
        open={dialogState.open}
        onClose={handleCloseOrderDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>รายการยาในออเดอร์</DialogTitle>
        <DialogContent dividers>
          {dialogState.selectedOrder.length > 0 ? (
            <List>
              {dialogState.selectedOrder.map((item) => (
                <ListItem key={item.Item_ID}>
                  <ListItemText
                    primary={`${item.Medicine_Name} - จำนวน: ${item.Quantity_Order}`}
                    secondary={`ราคา: ${item.Med_Cost} บาท`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>ไม่มีรายการยา</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Popup แสดงรายละเอียดการรักษาทั่วไป */}
      <Dialog
        open={!!selectedGeneralTreatment}
        onClose={handleCloseGeneralTreatment}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
          รายละเอียดการรักษาทั่วไป
        </DialogTitle>

        <DialogContent sx={{ paddingX: 4, paddingBottom: 2 }}>
          {selectedGeneralTreatment ? (
            <Box>
              {/* Diagnosis Section */}
              <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  การวินิจฉัยเบื้องต้น:
                </Typography>
                <Typography sx={{ paddingLeft: 2 }}>
                  {selectedGeneralTreatment.General_Details || 'ไม่มีข้อมูลการวินิจฉัย'}
                </Typography>
              </Paper>

              {/* Treatment Details Section */}
              <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  รายละเอียดการรักษา:
                </Typography>
                <Typography sx={{ paddingLeft: 2 }}>
                  {selectedGeneralTreatment.Treatment_Detail || 'ไม่มีรายละเอียดการรักษา'}
                </Typography>
              </Paper>

              {/* Additional Notes Section */}
              <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  บันทึกเพิ่มเติม:
                </Typography>
                <Typography sx={{ paddingLeft: 2 }}>
                  {selectedGeneralTreatment.Treatment_Others || 'ไม่มีบันทึกเพิ่มเติม'}
                </Typography>
              </Paper>
            </Box>
          ) : (
            <Typography sx={{ textAlign: 'center', marginTop: 4 }}>
              ไม่มีข้อมูลการรักษาทั่วไป
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          <Button onClick={handleCloseGeneralTreatment} variant="contained" color="primary">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={!!selectedPregnancyTreatment}
        onClose={handleClosePregnancyTreatment}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
          รายละเอียดการคุมกำเนิด
        </DialogTitle>

        <DialogContent sx={{ paddingX: 4, paddingBottom: 2 }}>
          {selectedPregnancyTreatment ? (
            <Box>
              {/* Contraception Type Section */}
              <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  ประเภทของการคุมกำเนิด:
                </Typography>
                <Typography>
                  {selectedPregnancyTreatment.Pregnancy_Control_Type || 'ไม่มีข้อมูล'}
                </Typography>
              </Paper>

              {/* Injection Frequency Section */}
              <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  ความถี่ในการฉีดยาคุมกำเนิด:
                </Typography>
                <Typography>
                  {selectedPregnancyTreatment.Freq_Pregnancies || 'ไม่มีข้อมูล'}
                </Typography>
              </Paper>

              {/* Problems Section */}
              <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  ปัญหาหรืออาการข้างเคียงจากการใช้ยาคุม:
                </Typography>
                <Typography>
                  {selectedPregnancyTreatment.Pregnancy_Problems || 'ไม่มีข้อมูล'}
                </Typography>
              </Paper>

              {/* Pregnancy Count Section */}
              <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  จำนวนครั้งในการตั้งครรภ์:
                </Typography>
                <Typography>
                  {selectedPregnancyTreatment.Total_Pregnancies || 'ไม่มีข้อมูล'}
                </Typography>
              </Paper>

              {/* Children Count Section */}
              <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  จำนวนบุตรทั้งหมด:
                </Typography>
                <Typography>
                  {selectedPregnancyTreatment.Total_Children || 'ไม่มีข้อมูล'}
                </Typography>
              </Paper>

              {/* Last Pregnancy Date Section */}
              <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  วันที่การตั้งครรภ์ล่าสุด:
                </Typography>
                <Typography>
                  {selectedPregnancyTreatment.Last_Pregnancy_Date || 'ไม่มีข้อมูล'}
                </Typography>
              </Paper>

              {/* Abortion History Section */}
              <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  ประวัติการแท้ง:
                </Typography>
                <Typography>
                  {selectedPregnancyTreatment.Abortion_History || 'ไม่มีข้อมูล'}
                </Typography>
              </Paper>

              {/* Other Treatment Details Section */}
              <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  รายละเอียดการรักษา:
                </Typography>
                <Typography>
                  {selectedPregnancyTreatment.Pregmed_Detail || 'ไม่มีรายละเอียดการรักษา'}
                </Typography>
              </Paper>

              {/* Additional Notes Section */}
              <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  เพิ่มเติม:
                </Typography>
                <Typography>
                  {selectedPregnancyTreatment.Preg_Others || 'ไม่มีข้อมูลเพิ่มเติม'}
                </Typography>
              </Paper>
            </Box>
          ) : (
            <Typography sx={{ textAlign: 'center', marginTop: 4 }}>
              ไม่มีข้อมูลการรักษาการตั้งครรภ์
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          <Button onClick={handleClosePregnancyTreatment} variant="contained" color="primary">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>


      {/* ปุ่มกลับและปุ่มต่อไป */}
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
            onClick={() => navigate(`/doctor_patientdetail/${HN}`)}
          >
            กลับ
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/doctor_addtreatment/${HN}`)}
          >
            ต่อไป
          </Button>
        </Box>
      </Grid>
    </Paper>
  );
};

export default TreatmentHistory;
