import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DoctorPatientDetail = () => {
  const { HN } = useParams();
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient/${HN}`); // ใช้ endpoint ที่ถูกต้องจาก server.js
        setPatientData(response.data.data[0]); // ตรวจสอบโครงสร้างข้อมูลที่ส่งกลับจาก API 
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, [HN]); // เรียก fetchPatientData ใหม่เมื่อ HN เปลี่ยนแปลง

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
          <p>โรคประจำตัว: {patientData.Disease_ID }

          </p>
        </div>
      ) : (
        <p>Loading...</p> // แสดงข้อความ loading ขณะรอข้อมูล
      )}
    </div>
  );
};

export default DoctorPatientDetail;
