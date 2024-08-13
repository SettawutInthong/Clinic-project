import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, TextField, Typography, Button, Box, ButtonGroup } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const DoctorPatientDetail = () => {
  const { HN } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [diseaseName, setDiseaseName] = useState('');
  const [allergyName, setAllergyName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient/${HN}`);
        const patient = response.data.data[0];
        setPatientData(patient);

        if (patient.Disease_ID) {
          const diseaseResponse = await axios.get(`http://localhost:5000/api/disease/${patient.Disease_ID}`);
          setDiseaseName(diseaseResponse.data.diseaseName);
        }

        if (patient.Allergy_ID) {
          const allergyResponse = await axios.get(`http://localhost:5000/api/allergy/${patient.Allergy_ID}`);
          setAllergyName(allergyResponse.data.allergyName);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPatientData();
  }, [HN]);

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      {patientData ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                  {patientData.HN}
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
                  value={calculateAge(patientData.Birthdate)}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="แพ้สาร"
                  value={allergyName || '-'}
                  InputProps={{ readOnly: true }}
                  fullWidth
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

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <ButtonGroup color="primary" aria-label="outlined primary button group">
                    <Button onClick={() => navigate(`/doctor_queue/`)} color="error">
                      กลับ
                    </Button>
                    <Button onClick={() => navigate(`/doctor_treatmenthistory/${patientData.HN}`)}>
                      ถัดไป
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <p>ไม่พบข้อมูลผู้ป่วย</p>
      )}
    </Box>
  );
};

export default DoctorPatientDetail;