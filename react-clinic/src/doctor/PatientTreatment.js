import React from 'react';

const PatientTreatment = ({ treatments }) => {
  if (!treatments || !Array.isArray(treatments)) {
    return <p>ยังไม่มีประวัติการรักษา</p>;
  }

  return (
    <div>
      {treatments.map((treatment, index) => (
        <div key={index}>
          <p>วันที่: {new Date(treatment.Date).toLocaleDateString('th-TH')}</p>
          <p>อาการ: {treatment.Symptom}</p>
          <p>การวินิจฉัย: {treatment.Diagnosis}</p>
          <p>ยาที่จ่าย: {treatment.Medicine}</p>
          {/* ... แสดงข้อมูลอื่นๆ ที่ต้องการ ... */}
        </div>
      ))}
    </div>
  );
};

export default PatientTreatment;
