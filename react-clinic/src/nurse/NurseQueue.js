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
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactSelect from "react-select";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const NurseQueue = () => {
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
  const [treatmentData, setTreatmentData] = useState({
    Heart_Rate: "",
    Pressure: "",
    Temp: "",
    Weight: "",
    Height: "",
    Symptom: "",
  });
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showTextFields, setShowTextFields] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newID, setNewID] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBirthdate, setNewBirthdate] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newDisease, setNewDisease] = useState("");
  const navigate = useNavigate();

  const SnackbarClose = () => {
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
      const sortedData = patientData.sort((a, b) => a.Queue_ID - b.Queue_ID);
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const AddQueue = async () => {
    try {
      if (!queueHN) {
        showMessage("กรุณาเลือก HN ของผู้ป่วย", "error");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/patient?HN=${queueHN}`
      );
      const patient = response.data.data[0];

      if (patient) {
        await axios.post("http://localhost:5000/api/walkinqueue", {
          HN: queueHN,
          Heart_Rate: treatmentData.Heart_Rate || null,
          Pressure: treatmentData.Pressure || null,
          Temp: treatmentData.Temp || null,
          Weight: treatmentData.Weight || null,
          Height: treatmentData.Height || null,
          Symptom: treatmentData.Symptom || null,
          Treatment_Details: null,
          Treatment_cost: null,
          Total_Cost: null,
        });

        FetchData();
        ResetForm();
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

  const handleCancel = () => {
    setShowTextFields(false);
    ResetForm();
    setAddQueuePopup(false);
  };

  const ViewPatient = async (HN) => {
    try {
      ResetForm();
      const response = await axios.get(
        `http://localhost:5000/api/patient?HN=${HN}`
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

        setSelectedHN(HN);
        setViewPopup(true);
      }
    } catch (error) {
      console.error("Error viewing patient:", error);
      showMessage("เกิดข้อผิดพลาดในการดูข้อมูลผู้ป่วย");
    }
  };

  const ResetForm = () => {
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

  const ViewOrder = (HN) => {
    navigate(`/nurse_order?HN=${HN}`);
  };

  const handleTreatmentChange = (e) => {
    const { name, value } = e.target;
    setTreatmentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    if (addQueuePopup) {
      const fetchPatients = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/patient");
          setPatientOptions(
            response.data.data.map((patient) => ({
              value: patient.HN,
              label: patient.HN,
            }))
          );
        } catch (error) {
          console.error("Error fetching patients:", error);
        }
      };
      fetchPatients();
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
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
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
                        {row.Queue_ID || "-"}
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
                        <ButtonGroup
                          color="primary"
                          aria-label="outlined primary button group"
                        >
                          <Button onClick={() => ViewOrder(row.HN)}>
                            <WysiwygIcon />
                          </Button>
                          <Button
                            onClick={() => DeleteQueue(row.HN)}
                            color="error"
                          >
                            <DeleteIcon />
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                  options={patientOptions}
                  onChange={handleHNSelect} // ใช้ฟังก์ชัน handleHNSelect
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
                        <FormControl style={{ width: "200px" }}>
                          <TextField
                            margin="dense"
                            label="คำนำหน้า"
                            value={newTitle}
                            fullWidth
                            disabled
                            sx={{
                              backgroundColor: "rgba(0, 0, 0, 0.1)",
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          />
                        </FormControl>
                        <TextField
                          margin="dense"
                          label="ชื่อ"
                          value={newFirstName}
                          fullWidth
                          disabled
                          sx={{
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        />
                      </Box>
                      <TextField
                        margin="dense"
                        label="นามสกุล"
                        value={newLastName}
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
                        value={newID}
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
                        value={
                          newBirthdate ? newBirthdate.toLocaleDateString() : ""
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
                        value={newPhone}
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
                        value={newDisease}
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
                        value={newAllergy}
                        fullWidth
                        disabled
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="dense"
                        label="อัตราการเต้นหัวใจ"
                        name="Heart_Rate"
                        value={treatmentData.Heart_Rate}
                        onChange={handleTreatmentChange}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                      <TextField
                        margin="dense"
                        label="ความดัน"
                        name="Pressure"
                        value={treatmentData.Pressure}
                        onChange={handleTreatmentChange}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                      <TextField
                        margin="dense"
                        label="อุณหภูมิ"
                        name="Temp"
                        value={treatmentData.Temp}
                        onChange={handleTreatmentChange}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                      <TextField
                        margin="dense"
                        label="น้ำหนัก"
                        name="Weight"
                        value={treatmentData.Weight}
                        onChange={handleTreatmentChange}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                      <TextField
                        margin="dense"
                        label="ส่วนสูง"
                        name="Height"
                        value={treatmentData.Height}
                        onChange={handleTreatmentChange}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                      <TextField
                        margin="dense"
                        label="อาการ"
                        name="Symptom"
                        value={treatmentData.Symptom}
                        onChange={handleTreatmentChange}
                        fullWidth
                        multiline
                        rows={4}
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

            {/* ส่วนของ Dialog และ Snackbar ที่เหลือ */}
          </div>
        </PaperStyled>
      </ContainerStyled>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={SnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={SnackbarClose}
          severity={snackbarType}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NurseQueue;
