import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom";   


const PatientTreatment = ({ treatments }) => {
  const navigate = useNavigate();

  const handleRowClick = (treatmentId) => {
    // นำทางไปยังหน้ารายละเอียดการรักษา (คุณต้องสร้างหน้านี้ขึ้นมาเอง)
    navigate(`/doctor_patienttreatment_detail/${treatmentId}`); 
  };
  if (!treatments || !Array.isArray(treatments)) {
    return <p>ยังไม่มีประวัติการรักษา</p>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>วันที่</TableCell>
            {/* เพิ่ม column อื่นๆ ตามต้องการ */}
          </TableRow>
        </TableHead>
        <TableBody>
          {treatments.map((treatment) => (
            <TableRow key={treatment.Treatment_ID} onClick={() => handleRowClick(treatment.Treatment_ID)} hover> {/* เพิ่ม onClick และ hover */}
              <TableCell>{new Date(treatment.Date).toLocaleDateString('th-TH')}</TableCell>
              {/* เพิ่ม cell อื่นๆ ตามต้องการ */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientTreatment;
