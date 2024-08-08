import {Grid,TextField,Box,Table,TableBody,TableCell,TableContainer,TableHead, TableRow,Paper,ButtonGroup, Button,Typography,} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@mui/material";

const PatientTreatment = () => {
  const { HN } = useParams();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [diseaseName, setDiseaseName] = useState(null);

  const handleRowClick = (treatmentId) => {
    navigate(`/doctor_patienttreatment_detail/${treatmentId}`);
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // ดึงข้อมูลผู้ป่วย
        const patientResponse = await axios.get(
          `http://localhost:5000/api/patient/${HN}`
        );
        setPatientData(patientResponse.data.data[0]);

        if (patientResponse.data.data[0].Disease_ID) {
          const diseaseResponse = await axios.get(
            `http://localhost:5000/api/disease/${patientResponse.data.data[0].Disease_ID}`
          );
          setDiseaseName(diseaseResponse.data.diseaseName);
        }

        // ดึงข้อมูล treatment โดยใช้ HN
        const treatmentResponse = await axios.get(
          `http://localhost:5000/api/treatment?HN=${HN}`
        );
        setTreatments(treatmentResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [HN]); 

  return (
    <div>
      {treatments && treatments.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Treatment ID</TableCell>
                <TableCell>HN</TableCell>
                <TableCell>วันที่รักษา</TableCell>
                <TableCell>รายละเอียด</TableCell>
                <TableCell>ค่าใช้จ่าย</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {treatments.map((treatment) => (
                <TableRow
                  key={treatment.Treatment_ID}
                  onClick={() => handleRowClick(treatment.Treatment_ID)}
                  hover
                >
                  <TableCell>{treatment.Treatment_ID}</TableCell>
                  <TableCell>{treatment.HN}</TableCell>
                  <TableCell>
                    {new Date(treatment.Treatment_Date).toLocaleDateString(
                      "th-TH"
                    )}
                  </TableCell>
                  <TableCell>{treatment.Treatment_Details}</TableCell>
                  <TableCell>{treatment.Treatment_cost}</TableCell>
                  <TableCell align="center">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" align="center" style={{ padding: "16px" }}>
          ยังไม่มีประวัติการรักษา
          <div>HN: {patientData && patientData.HN}</div>
        </Typography>
      )}
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
    </div>
  );
};

export default PatientTreatment;
