
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
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
import { Link } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ButtonGroup } from "@mui/material";

const DoctorQueue = () => {

  const [data, setData] = useState([]);
  const [searchHN, setSearchHN] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  const ContainerStyled = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(2),
  }));
  
  const PaperStyled = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
  }));

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
              
            </Box>

            {showTable && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>HN</TableCell>
                      <TableCell>คำนำหน้า</TableCell>
                      <TableCell>ชื่อ</TableCell>
                      <TableCell>นามสกุล</TableCell>
                      <TableCell>เพศ</TableCell>
                      <TableCell>Actions</TableCell>
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
                        <TableCell>{row.Title}</TableCell>
                        <TableCell>{row.First_Name}</TableCell>
                        <TableCell>{row.Last_Name}</TableCell>
                        <TableCell>{row.Gender}</TableCell>
                        <TableCell>
                          <ButtonGroup
                            color="primary"
                            aria-label="outlined primary button group"
                          >
                            
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {message && <p>{message}</p>}
          </div>
        </PaperStyled>
      </ContainerStyled>
    </Box>
  );

};

export default DoctorQueue;
