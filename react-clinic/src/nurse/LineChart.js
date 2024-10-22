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

      const limit = filter === "last_6_months" ? 6 : 7; 
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


  const groupOrdersByMonth = (orderData) => {
    const grouped = {};
    const today = new Date();

    
    const startDate = startOfMonth(addMonths(today, -6)); 
    const endDate = endOfMonth(addMonths(today, -1)); 

    const months = eachMonthOfInterval({ start: startDate, end: endDate }).map(
      (date) => format(date, "MMM")
    );

    months.forEach((month) => {
      grouped[month] = 0; 
    });

 
    orderData.forEach((order) => {
      const date = new Date(order.Order_Date);
      if (date >= startDate && date <= endDate) {
        const month = format(date, "MMM");

        grouped[month] += parseFloat(order.Total_cost); 
      }
    });

    console.log("Initialized months with 0 total cost:", grouped);
    console.log("Final grouped data after processing orderData:", grouped);

    return grouped;
  };

  
  const groupOrdersByDay = (orderData) => {
    const grouped = {};
    const today = new Date();

    
    const startDate = subDays(today, 7);
    const days = eachDayOfInterval({
      start: startDate,
      end: subDays(today, 1),
    }).map((date) => format(date, "dd MMM"));

    
    days.forEach((day) => {
      grouped[day] = 0; 
    });

    orderData.forEach((order) => {
      const date = new Date(order.Order_Date);
      if (date < today) {
        const day = format(date, "dd MMM");
        grouped[day] += order.Total_cost; 
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
          style={{ marginLeft: "10px", color: "#000" }} 
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
                position: "bottom", 
              },
              title: {
                display: true,
                text: "สถิติรายรับ", 
                align: "start", 
                font: {
                  size: 15, 
                },
                padding: {
                  bottom: 20, 
                },
              },
            },
            scales: {
              x: {
                type: "category",
              },
              y: {
                beginAtZero: true, 
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
