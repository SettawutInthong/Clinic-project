import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddTreatment = () => {
  const [HN, setHN] = useState('');
  const [orderID, setOrderID] = useState('');
  const [treatmentDate, setTreatmentDate] = useState('');
  const [treatmentDetails, setTreatmentDetails] = useState('');
  const [treatmentCost, setTreatmentCost] = useState('');
  const [patients, setPatients] = useState([]); // สำหรับเก็บรายชื่อผู้ป่วย

  useEffect(() => {
    // ดึงข้อมูลผู้ป่วยมาแสดงใน dropdown เมื่อ component โหลด
    axios.get('/api/patients')
      .then(res => setPatients(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/treatment', {
        HN,
        Order_ID: orderID,
        Treatment_Date: treatmentDate,
        Treatment_Details: treatmentDetails,
        Treatment_cost: treatmentCost
      });

      console.log(response.data); // ตรวจสอบผลลัพธ์จาก API

      // รีเซ็ตฟอร์มหลังจากส่งข้อมูลสำเร็จ
      setHN('');
      setOrderID('');
      setTreatmentDate('');
      setTreatmentDetails('');
      setTreatmentCost('');
    } catch (error) {
      console.error(error); // แสดงข้อผิดพลาดใน console
    }
  };

  return (
    <div>
      <h2>เพิ่มข้อมูลการรักษา</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="HN">HN:</label>
          <select id="HN" value={HN} onChange={(e) => setHN(e.target.value)}>
            <option value="">เลือกผู้ป่วย</option>
            {patients.map(patient => (
              <option key={patient.HN} value={patient.HN}>
                {patient.HN} - {patient.First_Name} {patient.Last_Name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="orderID">Order ID:</label>
          <input
            type="text"
            id="orderID"
            value={orderID}
            onChange={(e) => setOrderID(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="treatmentDate">วันที่รักษา:</label>
          <input
            type="date"
            id="treatmentDate"
            value={treatmentDate}
            onChange={(e) => setTreatmentDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="treatmentDetails">รายละเอียดการรักษา:</label>
          <textarea
            id="treatmentDetails"
            value={treatmentDetails}
            onChange={(e) => setTreatmentDetails(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="treatmentCost">ค่าใช้จ่าย:</label>
          <input
            type="number"
            id="treatmentCost"
            value={treatmentCost}
            onChange={(e) => setTreatmentCost(e.target.value)}
          />
        </div>

        <button type="submit">บันทึก</button>
      </form>
    </div>
  );
};

export default AddTreatment;
