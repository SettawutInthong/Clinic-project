import * as React from "react";
import { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const MedDetail = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editPopup, setEditPopup] = useState(false);
  const [editMedicine, setEditMedicine] = useState({});
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicineStock();
  }, []);

  const fetchMedicineStock = async (search = "", type = "") => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/medicine_stock?name=${search}&type=${type}`
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
    fetchMedicineStock(searchTerm, selectedType);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditClick = (medicine) => {
    setEditMedicine(medicine);
    setEditPopup(true);
  };

  const handleEditChange = (e) => {
    setEditMedicine({
      ...editMedicine,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/medicine_stock/${editMedicine.Medicine_ID}`,
        editMedicine
      );
      setEditPopup(false);
      fetchMedicineStock();
    } catch (err) {
      console.error("Error updating medicine:", err);
      setError(err.message);
      setSnackbarOpen(true);
    }
  };

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
        {/* จัดการ layout ด้วย flexbox */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center", // จัดให้อยู่ในแนวกลางตามแนวตั้ง
            gap: 2,
            mb: 2,
            flexWrap: "wrap", // เพิ่มการตัดบรรทัดถ้าหน้าจอเล็ก
          }}
        >
          <TextField
            label="ค้นหาชื่อยา"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ flex: 1 }} // ให้กล่องขยายเต็มพื้นที่
          />
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ flex: 1 }} // ให้กล่องขยายเต็มพื้นที่
          >
            <MenuItem value="">
              <em>เลือกประเภทยา</em>
            </MenuItem>
            <MenuItem value="ยาแก้ปวด">ยาแก้ปวด</MenuItem>
            <MenuItem value="ยาฆ่าเชื้อ">ยาฆ่าเชื้อ</MenuItem>
            <MenuItem value="ยาบำรุง">ยาบำรุง</MenuItem>
            <MenuItem value="ยาทา">ยาทา</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ height: "100%" }} // ปรับปุ่มให้มีความสูงเท่ากับกล่อง
          >
            ค้นหา
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/doctor_addstock`)}
            sx={{ height: "100%" }} // ปรับปุ่มให้มีความสูงเท่ากับกล่อง
          >
            เพิ่มสต็อก
          </Button>
        </Box>
      </Paper>

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
              <TableCell>Actions</TableCell>
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
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditClick(medicine)}
                  >
                    แก้ไข
                  </Button>
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
            disabled={currentPage === Math.ceil(medicines.length / itemsPerPage)}
          >
            ถัดไป
          </Button>
        </Box>
      </TableContainer>

      {/* Edit Medicine Dialog */}
      <Dialog open={editPopup} onClose={() => setEditPopup(false)}>
        <DialogTitle>แก้ไขข้อมูลยา</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ชื่อยา"
            name="Medicine_Name"
            value={editMedicine.Medicine_Name}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="คำอธิบาย"
            name="Description"
            value={editMedicine.Description}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="ประเภทยา"
            name="medicine_type"
            value={editMedicine.medicine_type}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="คงเหลือในคลัง"
            name="Quantity"
            value={editMedicine.Quantity}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="หน่วยนับ"
            name="Quantity_type"
            value={editMedicine.Quantity_type}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="ราคา(บาท)"
            name="Med_Cost"
            value={editMedicine.Med_Cost}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPopup(false)} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

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
