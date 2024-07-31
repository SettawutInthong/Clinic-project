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
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    let url = `http://localhost:5000/api/patient`;
    const params = {};

    if (searchHN) {
      params.HN = searchHN;
    }
    if (searchTitle) {
      params.Title = searchTitle;
    }
    if (searchFirstName) {
      params.First_Name = searchFirstName;
    }
    if (searchLastName) {
      params.Last_Name = searchLastName;
    }
    if (searchGender) {
      params.Gender = searchGender;
    }

    try {
      const response = await axios.get(url, { params });
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
    fetchData();
  };

  const resetForm = () => {
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
      const newPatient = {
        Title: newTitle,
        First_Name: newFirstName,
        Last_Name: newLastName,
        Gender: newGender,
        Birthdate: newBirthdate,
        Phone: newPhone,
        Disease: newDisease,
        Allergy: newAllergy,
      };

      await axios.post("http://localhost:5000/api/patient", newPatient);
      fetchData();
      setShowPopup(false);
      setMessage("");
      resetForm();
    } catch (error) {
      console.error("Error adding patient:", error);
      setMessage("เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ป่วย");
    }
  };

  const PatientDelete = async () => {};

  const PatientView = async () => {};

  useEffect(() => {
    if (showTable) {
      fetchData();
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
                  onChange={SearchHNChange}
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
                  onChange={SearchFirstNameChange}
                />
                <TextField
                  label="กรอกนามสกุล"
                  variant="outlined"
                  size="small"
                  onChange={SearchLastNameChange}
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
                onClick={() => setShowPopup(true)}
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
                        <TableCell component="th" scope="row">
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
                            <Button onClick={() => PatientView(row.HN)}>
                              ดู
                            </Button>
                            <Button onClick={() => PatientDelete(row.HN)}>
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
              open={showPopup}
              onClose={() => {
                setShowPopup(false);
                resetForm();
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
                <FormControl
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  size="small"
                  style={{ width: "110px" }}
                >
                  <InputLabel>เลือกเพศ</InputLabel>
                  <Select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    label="เลือกเพศ"
                  >
                    <MenuItem value="ชาย">ชาย</MenuItem>
                    <MenuItem value="หญิง">หญิง</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  label="กรอกหมายเลขโทรศัพท์"
                  type="text"
                  fullWidth
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="กรอกโรคประจำตัว"
                  type="text"
                  fullWidth
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="กรอกยาที่แพ้"
                  type="text"
                  fullWidth
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setShowPopup(false);
                    resetForm();
                  }}
                  color="primary"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={() => {
                    AddPatient();
                    resetForm();
                  }}
                  color="primary"
                >
                  บันทึก
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
