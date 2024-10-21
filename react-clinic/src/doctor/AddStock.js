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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate แทน useHistory
import DeleteIcon from "@mui/icons-material/Delete";

const AddStock = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantityInsert, setQuantityInsert] = useState(1);
  const [stockItems, setStockItems] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openMedicineDialog, setOpenMedicineDialog] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [popupConfirmOpen, setPopupConfirmOpen] = useState(false); // สำหรับ Popup ยืนยันหลังบันทึก
  const navigate = useNavigate(); // ใช้ useNavigate แทน useHistory

  useEffect(() => {
    const fetchMedicines = async () => {
      if (searchName.trim() !== "") {
        try {
          const response = await axios.get("http://localhost:5000/api/medicines", {
            params: { medicineName: searchName },
          });
          setMedicines(response.data.data);
        } catch (error) {
          console.error("Error fetching medicines:", error);
        }
      } else {
        // ถ้า searchName ว่างอยู่ ก็จะล้างข้อมูลใน medicines
        setMedicines([]);
      }
    };
  
    fetchMedicines();
  }, [searchName]); // เมื่อ searchName เปลี่ยนแปลงถึงจะเรียก API
  

  const handleAddMedicine = () => {
    if (selectedMedicine && quantityInsert > 0) {
      const newItem = {
        Medicine_ID: selectedMedicine.Medicine_ID,
        Medicine_Name: selectedMedicine.Medicine_Name,
        Quantity_insert: quantityInsert,
      };
      setStockItems([...stockItems, newItem]);
      setSelectedMedicine(null);
      setQuantityInsert(1);
      setSearchName(""); // Clear search after adding
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = stockItems.filter((_, i) => i !== index);
    setStockItems(updatedItems);
  };

  const handleConfirmSubmit = async () => {
    setConfirmDialogOpen(false);
    if (stockItems.length > 0) {
      try {
        await axios.post(
          "http://localhost:5000/api/stocks", // เรียก API เพื่อลงฐานข้อมูล
          { items: stockItems }
        );
        setPopupConfirmOpen(true); // แสดง Popup ยืนยันเมื่อบันทึกสำเร็จ
        setStockItems([]); // ล้างข้อมูล stock items หลังบันทึกสำเร็จ
      } catch (error) {
        console.error("Error submitting stock:", error.message);
      }
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handlePopupClose = () => {
    setPopupConfirmOpen(false);
    navigate("/doctor_meddetail"); // Redirect กลับไปหน้า meddetail หลังจากกดยืนยัน
  };

  const handleSubmitStock = () => {
    if (stockItems.length > 0) {
      setConfirmDialogOpen(true); // เปิด Popup ยืนยันก่อนบันทึก
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          เพิ่มสต็อกยา
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="ค้นหายา"
            variant="outlined"
            fullWidth
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenMedicineDialog(true)}
          >
            ค้นหา
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ชื่อยา</TableCell>
                <TableCell>จำนวน</TableCell>
                <TableCell>ลบ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.Medicine_Name}</TableCell>
                  <TableCell>{item.Quantity_insert}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleRemoveItem(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmitStock}
            disabled={stockItems.length === 0} // ปิดปุ่มหากยังไม่มีรายการยาที่เพิ่ม
          >
            บันทึกสต็อก
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            บันทึกสต็อกสำเร็จ
          </Alert>
        </Snackbar>

        <Dialog
          open={openMedicineDialog}
          onClose={() => setOpenMedicineDialog(false)}
        >
          <DialogTitle>ค้นหายา</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>ชื่อยา</TableCell>
                    <TableCell>เลือก</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicines.map((medicine) => (
                    <TableRow key={medicine.Medicine_ID}>
                      <TableCell>{medicine.Medicine_ID}</TableCell>
                      <TableCell>{medicine.Medicine_Name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setSelectedMedicine(medicine);
                          }}
                        >
                          เลือก
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {selectedMedicine && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  ยาที่เลือก: {selectedMedicine.Medicine_Name}
                </Typography>
                <TextField
                  label="จำนวน"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={quantityInsert}
                  onChange={(e) => setQuantityInsert(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    handleAddMedicine();
                    setOpenMedicineDialog(false);
                  }}
                >
                  เพิ่มในสต็อก
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenMedicineDialog(false)}
              color="primary"
            >
              ปิด
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>ยืนยันการบันทึกสต็อก</DialogTitle>
          <DialogContent>
            <Typography>คุณต้องการบันทึกสต็อกใช่หรือไม่?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmSubmit} color="secondary">
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog // Popup ยืนยันหลังจากบันทึกสำเร็จ
          open={popupConfirmOpen}
          onClose={handlePopupClose}
        >
          <DialogTitle>บันทึกสำเร็จ</DialogTitle>
          <DialogContent>
            <Typography>การบันทึกข้อมูลสต็อกสำเร็จแล้ว</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePopupClose} color="primary">
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default AddStock;
