import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, ButtonGroup, Grid, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const DoctorTreatmentHistory = () => {
  const { HN } = useParams(); // รับ HN จาก URL parameter
  const [treatments, setTreatments] = useState([]); // สถานะสำหรับเก็บข้อมูลการรักษา
  const [patientData, setPatientData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        // เรียก API เพื่อดึงข้อมูลการรักษาที่เชื่อมโยงกับ HN นี้
        const response = await axios.get(`http://localhost:5000/api/treatments/${HN}`);
        // ตั้งค่าข้อมูลการรักษา
        setTreatments(response.data.data || []); // ตรวจสอบและใช้ข้อมูลที่ตอบกลับหรือใช้ array ว่างถ้าไม่มีข้อมูล
      } catch (error) {
        console.error('Error fetching treatment data:', error);
      }
    };

    fetchTreatments();
  }, [HN]);

  return (
    <Paper>
      <Typography variant="h6" style={{ margin: '20px' }}>ประวัติการรักษาของผู้ป่วย HN: {HN}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>วันที่รักษา</TableCell>
              <TableCell>รายละเอียดการรักษา</TableCell>
              <TableCell>ค่าใช้จ่าย</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {treatments.map((treatment) => (
              <TableRow key={treatment.Treatment_ID}>
                <TableCell>{new Date(treatment.Treatment_Date).toLocaleDateString('th-TH')}</TableCell>
                <TableCell>{treatment.Treatment_Details}</TableCell>
                <TableCell>{treatment.Total_Cost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <ButtonGroup
            color="primary"
            aria-label="outlined primary button group"
            style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
          >
            <Button onClick={() => navigate(`/doctor_patientdetail/${HN}`)} color="error">
              กลับ
            </Button>
            <Button onClick={() => navigate(`/doctor_addtreatment/${HN}`)}>
              ถัดไป
            </Button>
          </ButtonGroup>
        </Box>
      </Grid>
    </Paper>
  );
};

export default DoctorTreatmentHistory;
