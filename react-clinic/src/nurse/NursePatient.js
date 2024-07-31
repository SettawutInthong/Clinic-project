import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ButtonGroup } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ReactSelect from "react-select";

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const NursePatient = () => {
  const [data, setData] = useState([]);
  const [searchHN, setSearchHN] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBirthdate, setNewBirthdate] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newDisease, setNewDisease] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedAllergy, setSelectedAllergy] = useState(null);
  const [selectedHN, setSelectedHN] = useState("");
  const [addPopup, setAddPopup] = useState(false);
  const [viewPopup, setViewPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  const FetchData = async () => {
    const params = {};
    if (searchHN) params.HN = searchHN;
    if (searchTitle) params.Title = searchTitle;
    if (searchFirstName) params.First_Name = searchFirstName;
    if (searchLastName) params.Last_Name = searchLastName;
    if (searchGender) params.Gender = searchGender;

    try {
      const response = await axios.get("http://localhost:5000/api/patient", {
        params,
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const SearchHNChange = (event) => {
    setSearchHN(event.target.value);
  };

  const SearchTitleChange = (event) => {
    setSearchTitle(event.target.value);
  };

  const SearchFirstNameChange = (event) => {
    setSearchFirstName(event.target.value);
  };

  const SearchLastNameChange = (event) => {
    setSearchLastName(event.target.value);
  };

  const SearchGenderChange = (event) => {
    setSearchGender(event.target.value);
  };

  const SearchSubmit = async (event) => {
    event.preventDefault();
    setShowTable(true);
    FetchData();
  };

  const ResetForm = () => {
    setNewTitle("");
    setNewFirstName("");
    setNewLastName("");
    setNewBirthdate(null);
    setNewGender("");
    setNewPhone("");
    setNewDisease("");
    setNewAllergy("");
  };

  const AddPatient = async () => {
    try {
      let gender = "";
      if (newTitle === "ด.ช." || newTitle === "นาย") {
        gender = "ชาย";
      } else {
        gender = "หญิง";
      }

      const newPatient = {
        Title: newTitle,
        First_Name: newFirstName,
        Last_Name: newLastName,
        Gender: gender,
        Birthdate: newBirthdate
          ? newBirthdate.toISOString().split("T")[0]
          : null,
        Phone: newPhone,
        Disease_ID: newDisease ? newDisease.value : null,
        Allergy_ID: newAllergy ? newAllergy.value : null,
      };

      await axios.post("http://localhost:5000/api/patient", newPatient);
      FetchData();
      setAddPopup(false);
      setMessage("");
      ResetForm();
    } catch (error) {
      console.error("Error adding patient:", error);
      setMessage("เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ป่วย");
    }
  };

  const DeletePatient = (HN) => {
    setSelectedHN(HN);
    setDeletePopup(true);
  };

  const ConfirmDeletePatient = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/patient/${selectedHN}`);
      FetchData();
      setDeletePopup(false);
      setMessage("");
    } catch (error) {
      console.error("Error deleting patient:", error);
      setMessage("เกิดข้อผิดพลาดในการลบข้อมูลผู้ป่วย");
    }
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
        setNewBirthdate(new Date(patient.Birthdate));
        setNewGender(patient.Gender);
        setNewPhone(patient.Phone);
        setNewDisease(
          diseases.find((disease) => disease.value === patient.Disease_ID)
        );
        setNewAllergy(
          allergies.find((allergy) => allergy.value === patient.Allergy_ID)
        );
        setSelectedHN(HN);
        setEdit(false);
        setViewPopup(true);
      }
    } catch (error) {
      console.error("Error viewing patient:", error);
      setMessage("เกิดข้อผิดพลาดในการดูข้อมูลผู้ป่วย");
    }
  };

  const EditPatient = async () => {
    try {
      const editPatient = {
        Title: newTitle,
        First_Name: newFirstName,
        Last_Name: newLastName,
        Gender: newGender,
        Birthdate: newBirthdate
          ? newBirthdate.toISOString().split("T")[0]
          : null,
        Phone: newPhone,
        Disease: newDisease.value,
        Allergy: newAllergy.value,
      };

      await axios.put(
        `http://localhost:5000/api/patient/${selectedHN}`,
        editPatient
      );
      FetchData();
      setViewPopup(false);
      setMessage("");
    } catch (error) {
      console.error("Error saving patient data:", error);
      setMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ป่วย");
    }
  };

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/allergies");
        setAllergies(
          response.data.data.map((item) => ({
            value: item.Allergy_ID,
            label: item.Allergy_Details,
          }))
        );
      } catch (error) {
        console.error("Error fetching allergies:", error);
      }
    };

    const fetchDiseases = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/diseases");
        setDiseases(
          response.data.data.map((item) => ({
            value: item.Disease_ID,
            label: item.disease_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching diseases:", error);
      }
    };

    fetchAllergies();
    fetchDiseases();
  }, []);

  useEffect(() => {
    if (showTable) {
      FetchData();
    }
  }, [showTable]);

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
              รายชื่อผู้ป่วย
            </Typography>
          </Box>
          <div>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <form
                onSubmit={SearchSubmit}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <TextField
                  label="กรอก HN"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setSearchHN(e.target.value)}
                  inputProps={{ maxLength: 5 }}
                  style={{ width: "100px" }}
                />
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ width: "140px" }}
                >
                  <InputLabel>เลือกคำนำหน้า</InputLabel>
                  <Select
                    value={searchTitle}
                    onChange={SearchTitleChange}
                    label="เลือกคำนำหน้า"
                  >
                    <MenuItem value="- Unknown -">- Unknown -</MenuItem>
                    <MenuItem value="ด.ช.">ด.ช.</MenuItem>
                    <MenuItem value="ด.ญ.">ด.ญ.</MenuItem>
                    <MenuItem value="นาย">นาย</MenuItem>
                    <MenuItem value="นาง">นาง</MenuItem>
                    <MenuItem value="นางสาว">นางสาว</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="กรอกชื่อ"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setSearchFirstName(e.target.value)}
                />
                <TextField
                  label="กรอกนามสกุล"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setSearchLastName(e.target.value)}
                />
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ width: "110px" }}
                >
                  <InputLabel>เลือกเพศ</InputLabel>
                  <Select
                    value={searchGender}
                    onChange={SearchGenderChange}
                    variant="outlined"
                    size="small"
                    label="เลือกเพศ"
                  >
                    <MenuItem value="- Unknown -">- Unknown -</MenuItem>
                    <MenuItem value="ชาย">ชาย</MenuItem>
                    <MenuItem value="หญิง">หญิง</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ height: "40px" }}
                  color="info"
                >
                  ค้นหา
                </Button>
              </form>
              <Button
                variant="contained"
                style={{ height: "40px", width: "150px" }}
                color="success"
                onClick={() => {
                  ResetForm();
                  setAddPopup(true);
                }}
              >
                <h1>+</h1>
              </Button>
            </Box>

            {showTable && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        HN
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
                        key={row.HN}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          style={{ flexGrow: 1, textAlign: "center" }}
                          component="th"
                          scope="row"
                        >
                          {row.HN}
                        </TableCell>
                        <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                          {row.Title}
                        </TableCell>
                        <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                          {row.First_Name}
                        </TableCell>
                        <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                          {row.Last_Name}
                        </TableCell>
                        <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                          {row.Gender}
                        </TableCell>
                        <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                          <ButtonGroup
                            color="primary"
                            aria-label="outlined primary button group"
                          >
                            <Button onClick={() => ViewPatient(row.HN)}>
                              ดู
                            </Button>
                            <Button onClick={() => DeletePatient(row.HN)}>
                              ลบ
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Dialog
              open={addPopup}
              onClose={() => {
                setAddPopup(false);
                ResetForm();
              }}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle
                id="form-dialog-title"
                style={{ flexGrow: 1, textAlign: "center" }}
              >
                เพิ่มผู้ป่วยใหม่
              </DialogTitle>
              <DialogContent>
                <FormControl
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  size="small"
                  style={{ width: "140px" }}
                >
                  <InputLabel>เลือกคำนำหน้า</InputLabel>
                  <Select
                    label="เลือกคำนำหน้า"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  >
                    <MenuItem value="- Unknown -">- Unknown -</MenuItem>
                    <MenuItem value="ด.ช.">ด.ช.</MenuItem>
                    <MenuItem value="ด.ญ.">ด.ญ.</MenuItem>
                    <MenuItem value="นาย">นาย</MenuItem>
                    <MenuItem value="นาง">นาง</MenuItem>
                    <MenuItem value="นางสาว">นางสาว</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  autoFocus
                  margin="dense"
                  label="กรอกชื่อ"
                  type="text"
                  fullWidth
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="กรอกนามสกุล"
                  type="text"
                  fullWidth
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="เลือกวันเกิด"
                    value={newBirthdate}
                    onChange={(date) => setNewBirthdate(date)}
                    inputFormat="dd/MM/yyyy"
                    slotProps={{
                      textField: { fullWidth: true, margin: "dense" },
                    }}
                  />
                </LocalizationProvider>

                <TextField
                  margin="dense"
                  label="กรอกหมายเลขโทรศัพท์"
                  type="text"
                  fullWidth
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
                <FormControl
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  size="small"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Box style={{ flex: 1 }}>
                    <ReactSelect
                      placeholder="เลือกโรคประจำตัว"
                      options={diseases}
                      value={newDisease}
                      onChange={setNewDisease}
                    />
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <ReactSelect
                      options={allergies}
                      value={newAllergy}
                      onChange={setNewAllergy}
                      placeholder="เลือกการแพ้ยา"
                    />
                  </Box>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setAddPopup(false);
                    ResetForm();
                  }}
                  color="primary"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={() => {
                    AddPatient();
                    ResetForm();
                  }}
                  color="primary"
                >
                  บันทึก
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
                <FormControl
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  size="small"
                  style={{ width: "140px" }}
                >
                  <InputLabel>คำนำหน้า</InputLabel>
                  <Select
                    label="คำนำหน้า"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    disabled={!edit}
                  >
                    <MenuItem value="- Unknown -">- Unknown -</MenuItem>
                    <MenuItem value="ด.ช.">ด.ช.</MenuItem>
                    <MenuItem value="ด.ญ.">ด.ญ.</MenuItem>
                    <MenuItem value="นาย">นาย</MenuItem>
                    <MenuItem value="นาง">นาง</MenuItem>
                    <MenuItem value="นางสาว">นางสาว</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  label="ชื่อ"
                  type="text"
                  fullWidth
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  disabled={!edit}
                />
                <TextField
                  margin="dense"
                  label="นามสกุล"
                  type="text"
                  fullWidth
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  disabled={!edit}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="วันเกิด"
                    value={newBirthdate}
                    onChange={(date) => setNewBirthdate(date)}
                    inputFormat="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "dense",
                        disabled: !edit,
                      },
                    }}
                  />
                </LocalizationProvider>
                <TextField
                  margin="dense"
                  label="หมายเลขโทรศัพท์"
                  type="text"
                  fullWidth
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  disabled={!edit}
                />
                <FormControl
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  size="small"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Box style={{ flex: 1 }}>
                    <ReactSelect
                      placeholder="เลือกโรคประจำตัว"
                      options={diseases}
                      value={newDisease}
                      onChange={setNewDisease}
                      isDisabled={!edit}
                    />
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <ReactSelect
                      options={allergies}
                      value={newAllergy}
                      onChange={setNewAllergy}
                      placeholder="เลือกการแพ้ยา"
                      isDisabled={!edit}
                    />
                  </Box>
                </FormControl>
              </DialogContent>
              <DialogActions>
                {edit ? (
                  <>
                    <Button onClick={() => setEdit(false)} color="primary">
                      ยกเลิก
                    </Button>
                    <Button onClick={EditPatient} color="primary">
                      บันทึก
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEdit(true)} color="primary">
                    แก้ไข
                  </Button>
                )}
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
                  คุณแน่ใจหรือว่าต้องการลบข้อมูลผู้ป่วยรายนี้
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeletePopup(false)} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={ConfirmDeletePatient} color="primary">
                  ลบ
                </Button>
              </DialogActions>
            </Dialog>

            {message && <p>{message}</p>}
          </div>
        </PaperStyled>
      </ContainerStyled>
    </Box>
  );
};

export default NursePatient;
