// DoctorPatientDetail.js (แก้ไขแล้ว)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DoctorPatientDetail = () => {
  const { HN } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [diseaseName, setDiseaseName] = useState(''); // เพิ่ม state สำหรับ Disease_name

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient/${HN}`);
        setPatientData(response.data.data[0]);

        if (response.data.data[0].Disease_ID) {
          const diseaseResponse = await axios.get(`http://localhost:5000/api/disease/${response.data.data[0].Disease_ID}`);
          setDiseaseName(diseaseResponse.data.diseaseName); 
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        // Handle error gracefully, maybe set an error state or display a message to the user
      }
    };

    fetchPatientData();
  }, [HN]);

  return (
    <div>
      {patientData ? (
        <div>
          <h2>ข้อมูลผู้ป่วย HN: {patientData.HN}</h2>
          <p>คำนำหน้า: {patientData.Title}</p>
          <p>ชื่อ: {patientData.First_Name}</p>
          <p>นามสกุล: {patientData.Last_Name}</p>
          <p>เพศ: {patientData.Gender}</p>
          <p>วันเกิด: {new Date(patientData.Birthdate).toLocaleDateString('th-TH')}</p>
          <p>เบอร์โทรศัพท์: {patientData.Phone}</p>
          <p>โรคประจำตัว: {diseaseName || '-'}</p>  
        </div>
      ) : (
        <p>Loading...</p> 
      )}
    </div>
  );
};

export default DoctorPatientDetail;
