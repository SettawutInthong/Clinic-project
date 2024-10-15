import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ButtonGroup } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import DeleteIcon from "@mui/icons-material/Delete";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import ReactSelect from "react-select";

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const DoctorQueue = () => {
  const [newID, setNewID] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBirthdate, setNewBirthdate] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newDisease, setNewDisease] = useState("");
  const [showTextFields, setShowTextFields] = useState(false);
  const [addQueueCheckInPopup, setAddQueueCheckInPopup] = useState(false);
  const [data, setData] = useState([]);
  const [viewPopup, setViewPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedHN, setSelectedHN] = useState("");
  const [patient, setPatient] = useState({});
  const [addQueuePopup, setAddQueuePopup] = useState(false);
  const [queueHN, setQueueHN] = useState("");
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [selectedOrder, setSelectedOrder] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบันเริ่มที่ 1
  const patientsPerPage = 10; // จำนวนผู้ป่วยต่อหน้า
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = data.slice(indexOfFirstPatient, indexOfLastPatient);
  const navigate = useNavigate();
  const [treatmentData, setTreatmentData] = useState({
    Heart_Rate: "",
    Pressure: "",
    Temp: "",
    Weight: "",
    Height: "",
    Symptom: "",
  });
  const [patientOptions, setPatientOptions] = useState([]);

  const nextPage = () => {
    if (currentPage < Math.ceil(data.length / patientsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showMessage = (message, type) => {
    setMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const FetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/walkinqueue");
      const queueData = response.data.data;

      const patientDataPromises = queueData.map(async (queue) => {
        const patientResponse = await axios.get(
          `http://localhost:5000/api/patient?HN=${queue.HN}`
        );
        const patient = patientResponse.data.data[0];
        return { ...queue, ...patient };
      });

      const patientData = await Promise.all(patientDataPromises);
      // แก้ไขส่วนนี้เพื่อให้เรียงตามเวลาของ Time
      const sortedData = patientData.sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.Time}`).getTime();
        const timeB = new Date(`1970-01-01T${b.Time}`).getTime();
        return timeA - timeB;
      });
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const AddQueue = async () => {
    // ตรวจสอบว่ากรอก HN หรือยัง
    if (!queueHN) {
      showMessage("กรุณาเลือก HN ของผู้ป่วย", "error");
      return; // หยุดทำงานถ้าไม่กรอก HN
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/patient?HN=${queueHN}`
      );
      const patient = response.data.data[0];

      if (patient) {
        await axios.post("http://localhost:5000/api/addWalkInQueue", {
          HN: queueHN,
          Heart_Rate: treatmentData.Heart_Rate || null,
          Pressure: treatmentData.Pressure || null,
          Temp: treatmentData.Temp || null,
          Weight: treatmentData.Weight || null,
          Height: treatmentData.Height || null,
          Symptom: treatmentData.Symptom || null,
        });

        FetchData();
        ResetForm(); // รีเซ็ตฟอร์มหลังจากจองคิวเสร็จสิ้น
        setAddQueuePopup(false);
        showMessage("จองคิวสำเร็จ", "success");
      } else {
        showMessage("ไม่พบ HN ที่ระบุ", "error");
      }
    } catch (error) {
      console.error("Error adding to queue or creating treatment:", error);
      showMessage("เกิดข้อผิดพลาดในการจองคิวหรือเพิ่มข้อมูลการรักษา", "error");
    }
  };

  const DeleteQueue = (HN) => {
    setSelectedHN(HN);
    setDeletePopup(true);
  };

  const ConfirmDeleteQueue = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/walkinqueue/${selectedHN}`);
      FetchData();
      setDeletePopup(false);
      showMessage("ลบข้อมูลผู้ป่วยจากคิวสำเร็จ");
    } catch (error) {
      console.error("Error deleting queue:", error);
      showMessage("เกิดข้อผิดพลาดในการลบข้อมูลผู้ป่วยจากคิว");
    }
  };

  const handleCancel = () => {
    setShowTextFields(false);
    ResetForm();
    setAddQueuePopup(false);
    setAddQueueCheckInPopup(false);
  };

  const handleTreatmentChange = (e) => {
    const { name, value } = e.target;
    setTreatmentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleHNSelect = async (selectedOption) => {
    setQueueHN(selectedOption ? selectedOption.value : "");
    setShowTextFields(!!selectedOption); // แสดงกล่องข้อความเมื่อ HN ถูกเลือก

    if (selectedOption) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/patient?HN=${selectedOption.value}`
        );
        const patient = response.data.data[0];
        if (patient) {
          setNewTitle(patient.Title);
          setNewFirstName(patient.First_Name);
          setNewLastName(patient.Last_Name);
          setNewID(patient.ID);
          setNewBirthdate(new Date(patient.Birthdate));
          setNewGender(patient.Gender);
          setNewPhone(patient.Phone);
          setNewAllergy(patient.Allergy);
          setNewDisease(patient.Disease);
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    } else {
      ResetForm();
    }
  };

  const ResetForm = () => {
    setQueueHN(""); // รีเซ็ตค่า HN เพื่อบังคับให้กรอกใหม่ทุกครั้ง
    setNewTitle("");
    setNewFirstName("");
    setNewLastName("");
    setNewID("");
    setNewBirthdate(null);
    setNewGender("");
    setNewPhone("");
    setNewDisease("");
    setNewAllergy("");
    setTreatmentData({
      Heart_Rate: "",
      Pressure: "",
      Temp: "",
      Weight: "",
      Height: "",
      Symptom: "",
    });
    setShowTextFields(false); // ซ่อนฟอร์ม
  };

  const fetchAvailablePatients = async () => {
    try {
      // ดึงข้อมูล HN ทั้งหมดจาก patient
      const responsePatients = await axios.get(
        "http://localhost:5000/api/patient"
      );
      const allPatients = responsePatients.data.data;

      // ดึงข้อมูล HN ทั้งหมดที่มีอยู่แล้วใน walkinqueue
      const responseQueue = await axios.get(
        "http://localhost:5000/api/walkinqueue"
      );
      const queuePatients = responseQueue.data.data.map((item) => item.HN);

      // กรองเฉพาะ HN ที่ยังไม่มีใน walkinqueue
      const availablePatients = allPatients.filter(
        (patient) => !queuePatients.includes(patient.HN)
      );

      // สร้าง options สำหรับ ReactSelect
      setPatientOptions(
        availablePatients.map((patient) => ({
          value: patient.HN,
          label: patient.HN,
        }))
      );
    } catch (error) {
      console.error("Error fetching available patients:", error);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    if (addQueuePopup) {
      fetchAvailablePatients(); // เรียกฟังก์ชันที่กรอง HN ที่ไม่มีใน walkinqueue
    }
  }, [addQueuePopup]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ContainerStyled maxWidth="lg">
        <PaperStyled>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography
              variant="h6"
              gutterBottom
              style={{ flexGrow: 1, textAlign: "center" }}
            >
              คิว
            </Typography>
          </Box>
          <div>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="contained"
                style={{ height: "40px", width: "150px" }}
                color="success"
                onClick={() => setAddQueuePopup(true)}
              >
                <AddToQueueIcon />
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      ลำดับคิว
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      คำนำหน้า
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      ชื่อ
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      นามสกุล
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      เพศ
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      สถานะ
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentPatients.map((row) => (
                    <TableRow
                      key={row.Queue_ID}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        style={{ flexGrow: 1, textAlign: "center" }}
                        component="th"
                        scope="row"
                      >
                        {new Date(`1970-01-01T${row.Time}`).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit", hour12: false }
                        ) || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        {row.Title || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        {row.First_Name || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        {row.Last_Name || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        {row.Gender || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        {row.Status || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        <ButtonGroup
                          color="primary"
                          aria-label="outlined primary button group"
                        >
                          <Button
                            onClick={() =>
                              navigate(`/doctor_patientdetail/${row.HN}`)
                            }
                           // disabled={row.Status !== "กำลังตรวจ"} // ปิดปุ่มถ้าสถานะไม่ใช่กำลังตรวจ
                          >
                            <VaccinesIcon />
                          </Button>
                          <Button
                            onClick={() => DeleteQueue(row.HN)}
                            color="error"
                            disabled={row.Status === "กำลังตรวจ"} // ปุ่มลบจะถูกปิดถ้ากำลังตรวจ
                          >
                            <DeleteIcon />
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button onClick={prevPage} disabled={currentPage === 1}>
                  ก่อนหน้า
                </Button>
                <Typography variant="body1" style={{ margin: "0 15px" }}>
                  {currentPage}
                </Typography>
                <Button
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(data.length / patientsPerPage)
                  }
                >
                  ถัดไป
                </Button>
              </Box>
            </TableContainer>

            <Dialog
              open={addQueuePopup}
              onClose={handleCancel}
              aria-labelledby="add-queue-dialog-title"
              maxWidth="lg"
              fullWidth
            >
              <DialogTitle
                id="add-queue-dialog-title"
                style={{ flexGrow: 1, textAlign: "center" }}
              >
                จองคิว
              </DialogTitle>
              <DialogContent>
                <ReactSelect
                  autoFocus
                  options={patientOptions} // ใช้ข้อมูล HN ที่ดึงมาแล้วถูกกรอง
                  onChange={handleHNSelect}
                  placeholder="กรอก HN"
                  isClearable
                  isSearchable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />

                {showTextFields && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" flexDirection="row" gap={2}>
                        <FormControl
                          fullWidth
                          margin="dense"
                          variant="outlined"
                          style={{ width: "275px" }}
                          size="small"
                        >
                          <TextField
                            margin="dense"
                            label="คำนำหน้า"
                            value={newTitle || ""}
                            fullWidth
                            disabled
                            size="small"
                            sx={{
                              backgroundColor: "rgba(0, 0, 0, 0.1)",
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          />
                        </FormControl>
                        <FormControl
                          fullWidth
                          margin="dense"
                          variant="outlined"
                          style={{ width: "275px" }}
                          size="small"
                        >
                          <TextField
                            margin="dense"
                            label="เพศ"
                            value={newGender || ""}
                            fullWidth
                            disabled
                            size="small"
                            sx={{
                              backgroundColor: "rgba(0, 0, 0, 0.1)",
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          />
                        </FormControl>
                      </Box>
                      <TextField
                        margin="dense"
                        label="ชื่อ"
                        size="small"
                        value={newFirstName || ""}
                        fullWidth
                        disabled
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <TextField
                        margin="dense"
                        label="นามสกุล"
                        size="small"
                        value={newLastName || ""}
                        fullWidth
                        disabled
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <TextField
                        margin="dense"
                        label="เลขบัตรประชาชน"
                        size="small"
                        value={newID || ""}
                        fullWidth
                        disabled
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <TextField
                        margin="dense"
                        label="วันเกิด"
                        size="small"
                        value={
                          newBirthdate
                            ? newBirthdate.toLocaleDateString()
                            : "" || ""
                        }
                        fullWidth
                        disabled
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <TextField
                        margin="dense"
                        label="หมายเลขโทรศัพท์"
                        size="small"
                        value={newPhone || ""}
                        fullWidth
                        disabled
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <TextField
                        margin="dense"
                        label="โรคประจำตัว"
                        size="small"
                        value={newDisease || ""}
                        fullWidth
                        disabled
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <TextField
                        margin="dense"
                        label="แพ้ยา"
                        size="small"
                        value={newAllergy || ""}
                        fullWidth
                        disabled
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ marginTop: "8px" }}>
                      <TextField
                        margin="dense"
                        label="อัตราการเต้นหัวใจ"
                        name="Heart_Rate"
                        size="small"
                        value={treatmentData.Heart_Rate}
                        onChange={handleTreatmentChange}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                      <TextField
                        margin="dense"
                        label="ความดัน"
                        name="Pressure"
                        size="small"
                        value={treatmentData.Pressure}
                        onChange={handleTreatmentChange}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                      <TextField
                        margin="dense"
                        label="อุณหภูมิ"
                        name="Temp"
                        size="small"
                        value={treatmentData.Temp}
                        onChange={handleTreatmentChange}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                      <TextField
                        margin="dense"
                        label="น้ำหนัก"
                        name="Weight"
                        size="small"
                        value={treatmentData.Weight}
                        onChange={handleTreatmentChange}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                      <TextField
                        margin="dense"
                        label="ส่วนสูง"
                        size="small"
                        name="Height"
                        value={treatmentData.Height}
                        onChange={handleTreatmentChange}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                      <TextField
                        margin="dense"
                        size="small"
                        label="อาการ"
                        name="Symptom"
                        value={treatmentData.Symptom}
                        onChange={handleTreatmentChange}
                        fullWidth
                        multiline
                        rows={6}
                        sx={{ backgroundColor: "white" }}
                      />
                    </Grid>
                  </Grid>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCancel} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={AddQueue} color="primary">
                  จองคิว
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={viewPopup}
              onClose={() => setViewPopup(false)}
              aria-labelledby="view-dialog-title"
            >
              <DialogTitle
                id="view-dialog-title"
                style={{ flexGrow: 1, textAlign: "center" }}
              >
                ดูข้อมูลผู้ป่วย
              </DialogTitle>
              <DialogContent>
                <Typography>HN: {patient.HN}</Typography>
                <Typography>คำนำหน้า: {patient.Title}</Typography>
                <Typography>ชื่อ: {patient.First_Name}</Typography>
                <Typography>นามสกุล: {patient.Last_Name}</Typography>
                <Typography>เพศ: {patient.Gender}</Typography>
                <Typography>วันเกิด: {patient.Birthdate}</Typography>
                <Typography>หมายเลขโทรศัพท์: {patient.Phone}</Typography>
                <Typography>โรคประจำตัว: {patient.Disease_ID}</Typography>
                <Typography>การแพ้ยา: {patient.Allergy_ID}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setViewPopup(false)} color="primary">
                  ปิด
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={deletePopup}
              onClose={() => setDeletePopup(false)}
              aria-labelledby="delete-dialog-title"
            >
              <DialogTitle id="delete-dialog-title">ยืนยันการลบ</DialogTitle>
              <DialogContent>
                <Typography>
                  คุณแน่ใจหรือว่าต้องการลบข้อมูลผู้ป่วยรายนี้จากคิว
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeletePopup(false)} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={ConfirmDeleteQueue} color="primary">
                  ลบ
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </PaperStyled>
      </ContainerStyled>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarType}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorQueue;
