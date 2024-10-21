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
  FormControl, 
  InputLabel  
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
  const [addPopup, setAddPopup] = useState(false); // สำหรับจัดการ popup เพิ่มยาใหม่
  const [editMedicine, setEditMedicine] = useState({});
  const [newMedicine, setNewMedicine] = useState({}); // สำหรับข้อมูลยาชนิดใหม่
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);


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

  const handleDeleteClick = (medicine) => {
    setSelectedMedicine(medicine); // เก็บข้อมูลยาที่ต้องการลบ
    setDeleteDialogOpen(true); // เปิด Dialog เพื่อยืนยันการลบ
  };

  const handleEditChange = (e) => {
    setEditMedicine({
      ...editMedicine,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/medicine_stock/${selectedMedicine.Medicine_ID}`);
      setDeleteDialogOpen(false); // ปิด Dialog หลังลบสำเร็จ
      setSelectedMedicine(null); // ล้างข้อมูลยาใน state
      fetchMedicineStock(); // โหลดข้อมูลใหม่หลังจากลบสำเร็จ
    } catch (err) {
      console.error("Error deleting medicine:", err);
      setError(err.message);
      setSnackbarOpen(true);
    }
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

  const handleDeleteMedicine = async (Medicine_ID) => {
    try {
      // เรียก API เพื่อลบยา
      await axios.delete(`http://localhost:5000/api/medicine_stock/${Medicine_ID}`);
      fetchMedicineStock(); // โหลดข้อมูลใหม่หลังจากลบสำเร็จ
    } catch (err) {
      console.error("Error deleting medicine:", err);
      setError(err.message);
      setSnackbarOpen(true);
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของข้อมูลยาชนิดใหม่
  const handleNewMedicineChange = (e) => {
    setNewMedicine({
      ...newMedicine,
      [e.target.name]: e.target.value,
    });
  };

  // ฟังก์ชันสำหรับเพิ่มยาชนิดใหม่
  const handleAddSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/medicine_stock", newMedicine);
      setAddPopup(false);
      fetchMedicineStock();
    } catch (err) {
      console.error("Error adding new medicine:", err);
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
              <div>เลือกประเภทยา</div>
            </MenuItem>
            <MenuItem value="ยาแก้ปวด">ยาแก้ปวด</MenuItem>
            <MenuItem value="ยาฆ่าเชื้อ">ยาฆ่าเชื้อ</MenuItem>
            <MenuItem value="ยาบำรุง">ยาบำรุง</MenuItem>
            <MenuItem value="ยาทา">ยาทา</MenuItem>
            <MenuItem value="ยาทางเดินอาหาร">ยาทางเดินอาหาร</MenuItem>
            <MenuItem value="ยาคุม">ยาคุม</MenuItem>
            <MenuItem value="ยาฉีด">ยาฉีด</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ height: "100%" }} // ปรับปุ่มให้มีความสูงเท่ากับกล่อง
          >
            ค้นหา
          </Button>
          {/* ปุ่มสำหรับเพิ่มสต็อก */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/doctor_addstock`)}
            sx={{ height: "100%" }} // ปรับปุ่มให้มีความสูงเท่ากับกล่อง
          >
            เพิ่มสต็อก
          </Button>
          {/* ปุ่มสำหรับเพิ่มยาชนิดใหม่ */}
          <Button
            variant="contained"
            color="success"
            onClick={() => setAddPopup(true)} // เปิด popup สำหรับเพิ่มยาใหม่
            sx={{ height: "100%" }} // ปรับปุ่มให้มีความสูงเท่ากับกล่อง
          >
            เพิ่มยาใหม่
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditClick(medicine)}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(medicine)}
                      sx={{ ml: 1 }} // เพิ่มระยะห่างระหว่างปุ่มแก้ไขกับลบ
                    >
                      ลบ
                    </Button>
                  </Box>
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)} // ปิด Dialog เมื่อคลิกปุ่มยกเลิก
      >
        <DialogTitle>ยืนยันการลบ</DialogTitle>
        <DialogContent>
          <Typography>
            คุณแน่ใจหรือไม่ว่าต้องการลบยา {selectedMedicine?.Medicine_Name} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            ลบ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Medicine Dialog */}
      <Dialog open={addPopup} onClose={() => setAddPopup(false)}>
        <DialogTitle>เพิ่มยาชนิดใหม่</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="ชื่อยา"
            name="Medicine_Name"
            onChange={handleNewMedicineChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="คำอธิบาย"
            name="Description"
            onChange={handleNewMedicineChange}
            fullWidth
          />
          {/* ใช้ FormControl และ InputLabel สำหรับ Select */}
          <FormControl fullWidth margin="normal">
            <InputLabel>ประเภทยา</InputLabel>
            <Select
              label="ประเภทยา"
              name="medicine_type"
              value={newMedicine.medicine_type || ""}
              onChange={handleNewMedicineChange}
            >
              <MenuItem value="ยาแก้ปวด">ยาแก้ปวด</MenuItem>
            <MenuItem value="ยาฆ่าเชื้อ">ยาฆ่าเชื้อ</MenuItem>
            <MenuItem value="ยาบำรุง">ยาบำรุง</MenuItem>
            <MenuItem value="ยาทา">ยาทา</MenuItem>
            <MenuItem value="ยาทางเดินอาหาร">ยาทางเดินอาหาร</MenuItem>
            <MenuItem value="ยาคุม">ยาคุม</MenuItem>
            <MenuItem value="ยาฉีด">ยาฉีด</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>ประเภทหน่วยนับ</InputLabel>
            <Select
              label="ประเภทหน่วยนับ"
              name="Quantity_type"
              value={newMedicine.Quantity_type || ""}
              onChange={handleNewMedicineChange}
            >
              <MenuItem value="Tablet">Tablet</MenuItem>
              <MenuItem value="Capsule">Capsule</MenuItem>
              <MenuItem value="Syrup">Syrup</MenuItem>
              <MenuItem value="Bottle">Bottle</MenuItem>
              <MenuItem value="Sheet">Sheet</MenuItem>
              <MenuItem value="Dose">Dose</MenuItem>
              </Select>
          </FormControl>

          <TextField
            margin="normal"
            label="คงเหลือในคลัง"
            name="Quantity"
            type="number"
            onChange={handleNewMedicineChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="ราคา(บาท)"
            name="Med_Cost"
            type="number"
            onChange={handleNewMedicineChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPopup(false)} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            เพิ่ม
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
