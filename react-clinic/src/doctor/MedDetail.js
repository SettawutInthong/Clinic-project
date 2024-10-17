import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const MedDetail = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 10; // Display 10 items per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicineStock();
  }, []);

  const fetchMedicineStock = async (search = "") => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/medicine_stock?name=${search}`
      );
      setMedicines(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching medicine stock:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMedicineStock(searchTerm);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = medicines.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(medicines.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          ค้นหายา
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="ค้นหาชื่อยา"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            ค้นหา
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/doctor_addstock`)}
          >
            เพิ่มสต็อก
          </Button>
        </Box>
      </Paper>

      {/* Displaying the medicine data */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>รหัสยา</TableCell>
              <TableCell>ชื่อยา</TableCell>
              <TableCell>คำอธิบาย</TableCell>
              <TableCell>ประเภทยา</TableCell>
              <TableCell>คงเหลือในคลัง</TableCell>
              <TableCell>ประเภทหน่วยนับ</TableCell>
              <TableCell>ราคา(บาท)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentMedicines.map((medicine) => (
              <TableRow key={medicine.Medicine_ID}>
                <TableCell>{medicine.Medicine_ID}</TableCell>
                <TableCell>{medicine.Medicine_Name}</TableCell>
                <TableCell>{medicine.Description}</TableCell>
                <TableCell>{medicine.medicine_type}</TableCell>
                <TableCell>{medicine.Quantity}</TableCell>
                <TableCell>{medicine.Quantity_type}</TableCell>
                <TableCell>{medicine.Med_Cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button onClick={prevPage} disabled={currentPage === 1}>
            ก่อนหน้า
          </Button>
          <Typography variant="body1" style={{ margin: "0 15px" }}>
            {currentPage}
          </Typography>
          <Button
            onClick={nextPage}
            disabled={currentPage === Math.ceil(medicines.length / itemsPerPage)}
          >
            ถัดไป
          </Button>
        </Box>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MedDetail;
