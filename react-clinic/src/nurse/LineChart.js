import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  addMonths,
  subDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  startOfMonth,
  endOfMonth,
} from "date-fns";

// ลงทะเบียน scales และ elements ที่จำเป็น
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("last_6_months");

  useEffect(() => {
    fetchOrderData(selectedFilter);
  }, [selectedFilter]);

  const fetchOrderData = async (filter) => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        params: { filter },
      });
      const orderData = response.data;
  
      let groupedData;
      if (filter === "last_6_months") {
        groupedData = groupOrdersByMonth(orderData);
      } else {
        groupedData = groupOrdersByDay(orderData);
      }
  
      const limit = filter === "last_6_months" ? 6 : 7; // ลบตัวเลือก "last_2_months" ออก
      const labels = Object.keys(groupedData).slice(0, limit);
      const data = Object.values(groupedData).slice(0, limit);
  
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "รายรับ (บาท)",
            data: data,
            borderColor: "green",
            backgroundColor: "green",
            fill: false,
            tension: 0.3,
            pointRadius: 5,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };
  
  // ฟังก์ชันจัดกลุ่มคำสั่งซื้อตามเดือน
  const groupOrdersByMonth = (orderData) => {
    const grouped = {};
    const today = new Date();

    // คำนวณช่วง 6 เดือนล่าสุด (ไม่รวมเดือนปัจจุบัน)
    const startDate = startOfMonth(addMonths(today, -6)); // เริ่มที่ 6 เดือนที่แล้ว
    const endDate = endOfMonth(addMonths(today, -1)); // สิ้นสุดที่เดือนก่อนเดือนปัจจุบัน (ไม่รวมเดือนปัจจุบัน)

    // สร้างลิสต์เดือน (เช่น Aug, Sep) พร้อมตั้งค่า Total_cost เป็น 0 เริ่มต้น
    const months = eachMonthOfInterval({ start: startDate, end: endDate }).map(
      (date) => format(date, "MMM")
    );

    months.forEach((month) => {
      grouped[month] = 0; // ตั้งค่าเริ่มต้น Total_cost ของแต่ละเดือนเป็น 0
    });

    // รวมข้อมูลจาก orderData ที่มีจริง
    orderData.forEach((order) => {
      const date = new Date(order.Order_Date);
      if (date >= startDate && date <= endDate) {
        const month = format(date, "MMM");

        // แปลง order.Total_cost เป็น number ก่อนบวก
        grouped[month] += parseFloat(order.Total_cost); // เพิ่มค่า Total_cost ของเดือนนั้นๆ ถ้ามีข้อมูล
      }
    });

    console.log("Initialized months with 0 total cost:", grouped);
    console.log("Final grouped data after processing orderData:", grouped);

    return grouped;
  };

  // ฟังก์ชันจัดกลุ่มคำสั่งซื้อตามวัน
  const groupOrdersByDay = (orderData) => {
    const grouped = {};
    const today = new Date();

    // คำนวณช่วง 7 วันที่ผ่านมา (ไม่รวมวันนี้)
    const startDate = subDays(today, 7);
    const days = eachDayOfInterval({
      start: startDate,
      end: subDays(today, 1),
    }).map((date) => format(date, "dd MMM"));

    // เติมข้อมูลในแต่ละวัน
    days.forEach((day) => {
      grouped[day] = 0; // ตั้งค่าเริ่มต้นเป็น 0
    });

    orderData.forEach((order) => {
      const date = new Date(order.Order_Date);
      if (date < today) {
        const day = format(date, "dd MMM");
        grouped[day] += order.Total_cost; // เพิ่มค่า Total_cost ของวันนั้นๆ
      }
    });

    return grouped;
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          color: "#000",
        }}
      >
      
        <select
          id="filter"
          value={selectedFilter}
          onChange={handleFilterChange}
          style={{ marginLeft: "10px", color: "#000" }} // เปลี่ยนสีเป็นสีดำ
        >
          <option value="last_6_months">6 เดือนที่ผ่านมา</option>
          
          <option value="last_7_days">7 วันที่ผ่านมา</option>
        </select>
      </div>

      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "bottom", // ตั้งให้แถบเขียวอยู่ล่าง
              },
              title: {
                display: true,
                text: "สถิติรายรับ", // เปลี่ยนคำว่า Statistics เป็น สถิติรายรับ
              },
              
            },
            scales: {
              x: {
                type: "category",
              },
              y: {
                beginAtZero: true, // แกน y ไม่ให้แสดงค่าติดลบ
              },
            },
          }}
        />
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
};

export default LineChart;
