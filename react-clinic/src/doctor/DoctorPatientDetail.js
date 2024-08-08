// DoctorPatientDetail.js (แก้ไขแล้ว)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, TextField, Typography, Button, Box, ButtonGroup } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';


const DoctorPatientDetail = () => {
  const { HN } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [diseaseName, setDiseaseName] = useState(''); // เพิ่ม state สำหรับ Disease_name
  const [treatments, setTreatments] = useState([]); // เพิ่ม state สำหรับ treatments
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient/${HN}`);
        setPatientData(response.data.data[0]);

        if (response.data.data[0].Disease_ID) {
          const diseaseResponse = await axios.get(`http://localhost:5000/api/disease/${response.data.data[0].Disease_ID}`);
          setDiseaseName(diseaseResponse.data.diseaseName);
        }

        // ดึงข้อมูล treatment
        const treatmentResponse = await axios.get(`http://localhost:5000/api/treatment/${HN}`);
        setTreatments(treatmentResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPatientData();
  }, [HN]);


  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      {patientData ? (
        <Card sx={{ borderRadius: 3 }}> {/* เพิ่ม borderRadius ที่นี่ */}
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                  HN: {patientData.HN}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="ชื่อ-นามสกุล"
                  value={`${patientData.Title}${patientData.First_Name} ${patientData.Last_Name}`}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="วันเกิด"
                  value={new Date(patientData.Birthdate).toLocaleDateString('th-TH')}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="อายุ"
                // value={/* คำนวณอายุจาก patientData.Birthdate */}
                // InputProps={{ readOnly: true }}
                // fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="น้ำหนัก"
                // value={/* ดึงข้อมูลน้ำหนักจาก patientData หรือ state อื่นๆ */}
                // InputProps={{ readOnly: true }}
                // fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="ส่วนสูง"
                // value={/* ดึงข้อมูลส่วนสูงจาก patientData หรือ state อื่นๆ */}
                // InputProps={{ readOnly: true }}
                // fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="อัตราการเต้นของหัวใจ"
                // value={/* ดึงข้อมูลอัตราการเต้นหัวใจจาก patientData หรือ state อื่นๆ */}
                // InputProps={{ readOnly: true }}
                // fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="ความดัน"
                // value={/* ดึงข้อมูลความดันจาก patientData หรือ state อื่นๆ */}
                // InputProps={{ readOnly: true }}
                // fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="โรคประจำตัว"
                  value={diseaseName || '-'}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="แพ้ยา"
                // value={/* ดึงข้อมูลการแพ้ยาจาก patientData หรือ state อื่นๆ */}
                // InputProps={{ readOnly: true }}
                // fullWidth
                />
              </Grid>
        

              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button onClick={() => navigate(`/doctor_queue/`)}>
                  กลับ
                </Button>
                <Button onClick={() => navigate(`/doctor_patienttreatment/${patientData.HN}`)}>
                  ถัดไป
                </Button>
                
              </ButtonGroup>



            </Grid>
          </CardContent>
        </Card>

      ) : (
        <p>Loading...</p>
      )
      }
    </Box >
  );
};

export default DoctorPatientDetail;
