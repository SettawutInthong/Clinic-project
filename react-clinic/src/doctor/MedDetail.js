import React, { useState, useEffect } from "react";
import axios from "axios";
import {Box,Button,TextField,Typography,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Snackbar,Alert} from "@mui/material";
import { useNavigate } from "react-router-dom"; // ใช้สำหรับนำทาง

const MedDetail = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // คีย์เวิร์ดการค้นหา
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate(); // สำหรับใช้ navigate ไปยังหน้าอื่น

  useEffect(() => {
    fetchMedicineStock();
  }, []);

  const fetchMedicineStock = async (search = "") => {
    try {
      const response = await axios.get(`http://localhost:5000/api/medicine_stock?name=${search}`);
      setMedicines(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching medicine stock:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMedicineStock(searchTerm); // ค้นหาตามคีย์เวิร์ด
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };



  return (
    <Box sx={{ padding: 3 }}>
      {/* กล่องสีขาวสำหรับส่วนค้นหา */}
      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          ค้นหายา
        </Typography>

        {/* Search Field */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="ค้นหาชื่อยา"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // อัปเดตคีย์เวิร์ด
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            ค้นหา
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate(`/doctor_addstock`)}>
            เพิ่มสต็อก
          </Button>
          
        </Box>
      </Paper>

      {/* ตารางข้อมูลยาและสต็อก */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>รหัสยา</TableCell>
              <TableCell>ชื่อยา</TableCell>
              <TableCell>คำอธิบาย</TableCell>
              <TableCell>ราคาต่อหน่วย (บาท)</TableCell>
              <TableCell>ประเภทหน่วยนับ</TableCell>
              <TableCell>คงเหลือในคลัง</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((medicine) => (
              <TableRow key={medicine.Medicine_ID}>
                <TableCell>{medicine.Medicine_ID}</TableCell>
                <TableCell>{medicine.Medicine_Name}</TableCell>
                <TableCell>{medicine.Description}</TableCell>
                <TableCell>{medicine.Med_Cost}</TableCell>
                <TableCell>{medicine.Quantity_type}</TableCell>
                <TableCell>{medicine.Quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        
      </Snackbar>
    </Box>
  );
};

export default MedDetail;
