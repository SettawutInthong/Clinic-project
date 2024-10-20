var express = require("express");
var cors = require("cors");
var app = express();
const crypto = require("crypto");
var bodyParser = require("body-parser");

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "clinic",
});

const db = connection.promise();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

//ดึง user
app.post("/clinic/users", function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" });
  }

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.execute(sql, [username, password], function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      const user = results[0];
      const accessToken = generateToken();

      const updateSql = "UPDATE users SET accessToken = ? WHERE role_id = ?";
      connection.execute(
        updateSql,
        [accessToken, user.Role_ID],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ accessToken, user });
        }
      );
    } else {
      res.status(401).json({ error: "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง" });
    }
  });
});

// API สำหรับเพิ่มข้อมูลการรักษา
app.post("/api/addtreatment", async (req, res) => {
  const {
    HN,
    Order_ID,
    Treatment_Date,
    Treatment_Details,
    Treatment_cost,
    Total_Cost,
    Symptom,
    Weight,
    Height,
    Temp,
    Pressure,
    Heart_Rate,
  } = req.body;

  try {
    const [maxTreatmentResult] = await db.query(`
      SELECT MAX(Treatment_ID) as maxTreatmentID FROM treatment
    `);
    const newTreatmentID = generateID(
      maxTreatmentResult[0].maxTreatmentID,
      "T"
    );

    // เพิ่มข้อมูลคำสั่ง (Order) ลงในตาราง orders
    await db.query(
      `
      INSERT INTO orders (Order_ID, HN, Order_Date)
      VALUES (?, ?, ?)
    `,
      [Order_ID, HN, new Date().toISOString().split("T")[0]]
    );

    // เพิ่มข้อมูลการรักษา (treatment) ลงในตาราง treatment
    await db.query(
      `
      INSERT INTO treatment (Treatment_ID, HN, Order_ID, Treatment_Date, Treatment_Details, Treatment_cost, Total_Cost, Symptom, Weight, Height, Temp, Pressure, Heart_Rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        newTreatmentID,
        HN,
        Order_ID,
        Treatment_Date,
        Treatment_Details,
        Treatment_cost,
        Total_Cost,
        Symptom,
        Weight,
        Height,
        Temp,
        Pressure,
        Heart_Rate,
      ]
    );

    res.status(201).json({
      message: "เพิ่มข้อมูลการรักษาสำเร็จ",
      Treatment_ID: newTreatmentID,
    });
  } catch (error) {
    console.error("Error adding treatment:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลการรักษา" });
  }
});

//ดึงข้อมูลการรักษา (Treatments)
app.get("/api/treatmentsss", function (req, res) {
  const sql = "SELECT * FROM treatment";
  connection.execute(sql, function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});

// เพิ่มผู้ป่วยเข้า walkinqueue พร้อมกับเวลาจาก Queue_Time
app.post("/api/walkinqueue", async (req, res) => {
  const { HN } = req.body;

  try {
    // Retrieve Queue_Time from appointmentqueue for the selected HN
    const [appointment] = await db.query(
      "SELECT Queue_Time FROM appointmentqueue WHERE HN = ?",
      [HN]
    );

    if (appointment.length === 0) {
      return res.status(404).json({
        error: "No appointment found for the provided HN.",
      });
    }

    const queueTime = appointment[0].Queue_Time;

    // Retrieve the maximum Time from walkinqueue
    const [maxQueueTimeResult] = await db.query(
      "SELECT MAX(Time) as maxTime FROM walkinqueue"
    );

    let newQueueTime = queueTime;
    if (maxQueueTimeResult[0].maxTime) {
      const maxTime = new Date(`1970-01-01T${maxQueueTimeResult[0].maxTime}`);
      newQueueTime = new Date(maxTime.getTime() + 15 * 60000) // เพิ่ม 15 นาที
        .toTimeString()
        .split(" ")[0];
    }

    // Retrieve the maximum Queue_ID and increment by 1
    const [maxQueue] = await db.query(
      "SELECT MAX(Queue_ID) as maxQueueID FROM walkinqueue"
    );
    const newQueueID = maxQueue[0].maxQueueID ? maxQueue[0].maxQueueID + 1 : 1;

    // Insert the new record into walkinqueue
    await db.query(
      "INSERT INTO walkinqueue (Queue_ID, HN, Time, Status) VALUES (?, ?, ?, 'รอตรวจ')",
      [newQueueID, HN, newQueueTime]
    );

    res.status(201).json({
      message: "Patient successfully checked in with updated queue time.",
    });
  } catch (err) {
    console.error("Error adding patient to walkinqueue:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ป่วย" });
  }
});

// ตรวจสอบว่ามี HN ในคิวแล้วหรือไม่
app.get("/api/walkinqueue/:HN", async (req, res) => {
  const { HN } = req.params;
  try {
    const [result] = await db.query("INSERT INTO walkinqueue (HN) VALUES (?)", [
      HN,
    ]);

    if (result.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking queue:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบคิว" });
  }
});

//สำหรับค้นหาผู้ป่วย
app.get("/api/patients", function (req, res) {
  const { hn, firstName, lastName } = req.query;

  let sql = "SELECT * FROM patient WHERE 1=1";
  const values = [];

  if (hn) {
    sql += " AND HN LIKE ?";
    values.push(`%${hn}%`);
  }
  if (firstName) {
    sql += " AND First_Name LIKE ?";
    values.push(`%${firstName}%`);
  }
  if (lastName) {
    sql += " AND Last_Name LIKE ?";
    values.push(`%${lastName}%`);
  }

  connection.query(sql, values, function (err, results) {
    if (err) throw err;
    res.json(results);
  });
});

//ดึงข้อมูลการรักษา (Treatments) ตาม HN
app.get("/api/treatments/:HN", function (req, res) {
  const HN = req.params.HN;

  const sql = `
    SELECT * 
    FROM treatment 
    WHERE HN = ?
    ORDER BY Treatment_Date DESC
  `;
  connection.query(sql, [HN], function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ data: results });
  });
});

function generateID(currentMaxID, prefix) {
  if (!currentMaxID || isNaN(parseInt(currentMaxID.substring(3), 10))) {
    // ถ้าไม่มีค่า currentMaxID หรือแปลงเป็นตัวเลขไม่ได้ ให้เริ่มต้นที่ INO00001
    return `${prefix}00001`;
  }
  const nextNumber = parseInt(currentMaxID.substring(3), 10) + 1;
  return `${prefix}${nextNumber.toString().padStart(5, "0")}`;
}

//ดึงข้อมูลการรักษา
app.get("/api/treatment/:HN/latest", async (req, res) => {
  const { HN } = req.params;

  try {
    const [treatment] = await db.query(
      "SELECT * FROM treatment WHERE HN = ? ORDER BY Treatment_Date DESC LIMIT 1",
      [HN]
    );

    if (treatment.length === 0) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    res.status(200).json({ data: treatment[0] });
  } catch (error) {
    res.status(500).json({ error: "Error fetching treatment" });
  }
});

// API to search medicines by name
app.get("/api/medicines", (req, res) => {
  const { medicineName } = req.query;

  const sql = "SELECT * FROM medicine WHERE Medicine_Name LIKE ?";
  const params = [`%${medicineName}%`];

  connection.query(sql, params, (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data: results });
  });
});

//เพิ่มรายการยาลงใน order
app.post("/api/orders/:orderID/items", async (req, res) => {
  const { orderID } = req.params;
  const { items } = req.body;

  try {
    const [result] = await db.query(`
      SELECT MAX(Item_ID) as maxItemID FROM order_medicine
    `);

    let maxItemID = result[0].maxItemID;
    const itemPromises = items.map((item) => {
      const newItemID = generateID(maxItemID, "I");

      maxItemID = newItemID;

      return db.query(
        `
          INSERT INTO order_medicine (Item_ID, Order_ID, Medicine_ID, Quantity_Order)
          VALUES (?, ?, ?, ?)
        `,
        [newItemID, orderID, item.Medicine_ID, item.Quantity]
      );
    });

    await Promise.all(itemPromises);
    res.json({ message: "เพิ่มรายการยาสำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มรายการยา" });
  }
});

app.get("/api/medicine_stock", async (req, res) => {
  const name = req.query.name || ""; // รับคีย์เวิร์ดค้นหาจาก query parameters
  const type = req.query.type || ""; // รับประเภทยา

  try {
    let sql = `
      SELECT Medicine_ID, Medicine_Name, Description, Med_Cost, Quantity_type, Quantity, medicine_type
      FROM medicine 
      WHERE Medicine_Name LIKE ?
    `;
    const params = [`%${name}%`];

    // กรองตามประเภทของยาถ้ามีการส่งค่า type มา
    if (type) {
      sql += " AND medicine_type = ?";
      params.push(type);
    }

    const [results] = await db.query(sql, params);

    res.json({ data: results });
  } catch (error) {
    console.error("Error fetching medicine stock data:", error);
    res.status(500).json({ error: "Error fetching medicine stock data" });
  }
});

app.post("/api/stocks", async (req, res) => {
  const { items } = req.body;
  const inovicDate = new Date().toISOString().split("T")[0];

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "ไม่มีรายการสต็อกในคำขอ" });
    }

    console.log("Received items:", items);

    // ดึงค่า Inovic_ID สูงสุดปัจจุบัน
    const [inovicResult] = await connection.promise().query(`
      SELECT MAX(Inovic_ID) as maxInovicID FROM inovic
    `);

    console.log("Inovic Result:", inovicResult);

    // ตรวจสอบว่า maxInovicID มีค่าหรือไม่ ถ้าไม่มีให้เริ่มที่ 'INO00001'
    const newInovicID = inovicResult[0].maxInovicID
      ? generateID(inovicResult[0].maxInovicID, "INO")
      : "INO00001";

    console.log("New Inovic_ID:", newInovicID);

    // เพิ่มรายการลงในตาราง inovic
    await connection
      .promise()
      .query(`INSERT INTO inovic (Inovic_ID, Inovic_Date) VALUES (?, ?)`, [
        newInovicID,
        inovicDate,
      ]);

    for (const item of items) {
      const { Medicine_ID, Quantity_insert } = item;

      if (!Medicine_ID || !Quantity_insert) {
        return res
          .status(400)
          .json({ error: "Medicine_ID หรือ Quantity_insert ไม่ครบถ้วน" });
      }

      const [stockResult] = await connection.promise().query(`
        SELECT MAX(Stock_ID) as maxStockID FROM stock
      `);

      const newStockID = stockResult[0].maxStockID
        ? generateID(stockResult[0].maxStockID, "ST")
        : "ST00001";

      console.log("New Stock_ID:", newStockID);

      await connection
        .promise()
        .query(
          `INSERT INTO stock (Stock_ID, Medicine_ID, Quantity_insert, Inovic_ID) VALUES (?, ?, ?, ?)`,
          [newStockID, Medicine_ID, Quantity_insert, newInovicID]
        );
    }

    res.status(201).json({ message: "เพิ่มรายการสต็อกสำเร็จ" });
  } catch (error) {
    console.error("Error adding stock:", error.stack);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มสต็อก" });
  }
});

///////////////////////ใช้///////////////////////////////////////////////////////
// ดึง Order_ID ที่มากที่สุดจากตาราง orders
app.get("/api/order_medicine", async (req, res) => {
  const HN = req.query.HN;
  try {
    const sql = `
      SELECT * FROM orders 
      WHERE HN = ? 
      ORDER BY CAST(SUBSTRING(Order_ID, 2) AS UNSIGNED) DESC 
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [HN]);
    if (rows.length > 0) {
      res.json({ data: rows[0] });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//ดูข้อมูลผู้ป่วย
app.get("/api/patient/:HN", function (req, res) {
  const HN = req.params.HN;
  const sql = "SELECT * FROM patient WHERE HN = ?";
  connection.execute(sql, [HN], function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});

// ดึงรายละเอียดของยาใน order_medicine โดยอิงจาก Order_ID
app.get("/api/medicine_details", async (req, res) => {
  const Order_ID = req.query.Order_ID;
  try {
    const sql = `
      SELECT om.Item_ID, om.Quantity_Order, m.Medicine_Name, m.Med_Cost
      FROM order_medicine om 
      JOIN medicine m ON om.Medicine_ID = m.Medicine_ID 
      WHERE om.Order_ID = ?
    `;
    const [rows] = await db.query(sql, [Order_ID]);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ดึงข้อมูล Treatment_cost จากตาราง treatment ตาม Order_ID
app.get("/api/treatment_cost", function (req, res) {
  const Order_ID = req.query.Order_ID;

  const sql = "SELECT Treatment_cost FROM treatment WHERE Order_ID = ?";
  connection.execute(sql, [Order_ID], function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.json({ Treatment_cost: results[0].Treatment_cost });
    } else {
      res.status(404).json({ error: "ไม่พบข้อมูลค่ารักษา" });
    }
  });
});

// ดึงข้อมูลคิวผู้ป่วย (Walk-In Queue)
app.get("/api/walkinqueue", function (req, res) {
  const sql = `
    SELECT w.Queue_ID, w.HN, w.Time, w.Status, p.Title, p.First_Name, p.Last_Name, p.Gender
    FROM walkinqueue w
    JOIN patient p ON w.HN = p.HN
    WHERE w.Status != 'เสร็จสิ้น' -- ซ่อนสถานะ 'เสร็จสิ้น'
    ORDER BY 
      CASE 
        WHEN w.Status = 'รอจ่ายยา' THEN 1
        WHEN w.Status = 'กำลังตรวจ' THEN 2
        WHEN w.Status = 'รอตรวจ' THEN 3
        ELSE 4 
      END, 
      w.Time ASC
  `;
  connection.execute(sql, function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});

// API สำหรับดึงข้อมูลจาก appointmentqueue รวม HN, ชื่อผู้ป่วย และเรียงตามวันและเวลา
app.get("/api/appointmentqueue", async (req, res) => {
  const HN = req.query.HN;
  try {
    let query = `
      SELECT appointmentqueue.HN, appointmentqueue.Queue_Date, appointmentqueue.Queue_Time, patient.First_Name, patient.Last_Name 
      FROM appointmentqueue
      JOIN patient ON appointmentqueue.HN = patient.HN
    `;
    const params = [];

    if (HN) {
      query += " WHERE appointmentqueue.HN = ?";
      params.push(HN);
    }

    // เพิ่มการเรียงลำดับตาม Queue_Date และ Queue_Time
    query +=
      " ORDER BY appointmentqueue.Queue_Date ASC, appointmentqueue.Queue_Time ASC";

    const [rows] = await db.query(query, params);
    res.json({ data: rows });
  } catch (error) {
    console.error("Error fetching appointmentqueue:", error);
    res.status(500).json({ message: "Error fetching appointmentqueue" });
  }
});

//เพิ่มคิว
app.post("/api/addWalkInQueue", async (req, res) => {
  const { HN, Heart_Rate, Pressure, Temp, Weight, Height, Symptom } = req.body;

  try {
    // ดึงเวลาสูงสุดจาก walkinqueue
    const [maxQueueTimeResult] = await db.query(
      "SELECT MAX(Time) as maxTime FROM walkinqueue"
    );

    let newQueueTime;

    if (!maxQueueTimeResult[0].maxTime) {
      // ถ้าไม่มีคิวในระบบ ให้กำหนดเวลาเริ่มต้นเป็นเวลาใกล้เคียงกับนาที 00, 15, 30, 45
      let currentTime = new Date();
      const currentMinutes = currentTime.getMinutes();

      // คำนวณเวลาใกล้เคียงกับนาทีที่ลงท้ายด้วย 00, 15, 30, 45
      const nextSlotMinutes = Math.ceil(currentMinutes / 15) * 15;

      // ถ้าเกิน 60 นาที ให้อัพเดตชั่วโมง
      if (nextSlotMinutes === 60) {
        currentTime.setHours(currentTime.getHours() + 1);
        currentTime.setMinutes(0);
      } else {
        currentTime.setMinutes(nextSlotMinutes);
      }

      newQueueTime = currentTime.toTimeString().split(" ")[0];
    } else {
      // ถ้ามีคิวอยู่แล้ว เพิ่ม 15 นาทีจากเวลาสูงสุดในระบบ
      const maxTime = new Date(`1970-01-01T${maxQueueTimeResult[0].maxTime}`);
      newQueueTime = new Date(maxTime.getTime() + 15 * 60000)
        .toTimeString()
        .split(" ")[0];
    }

    // ดึงค่า Queue_ID สูงสุดและเพิ่ม 1
    const [maxQueue] = await db.query(
      "SELECT MAX(Queue_ID) as maxQueueID FROM walkinqueue"
    );
    const newQueueID = maxQueue[0].maxQueueID ? maxQueue[0].maxQueueID + 1 : 1;

    // เพิ่มข้อมูลเข้า walkinqueue
    await db.query(
      "INSERT INTO walkinqueue (Queue_ID, HN, Time, Status) VALUES (?, ?, ?, 'รอตรวจ')",
      [newQueueID, HN, newQueueTime]
    );

    // สร้าง Order_ID ใหม่
    const [maxOrderResult] = await db.query(
      "SELECT MAX(Order_ID) as maxOrderID FROM orders"
    );
    let newOrderID = "O00001"; // กำหนดค่าเริ่มต้นสำหรับ Order_ID
    if (maxOrderResult[0].maxOrderID !== null) {
      const maxOrderID = maxOrderResult[0].maxOrderID;
      if (typeof maxOrderID === "string") {
        const orderNumberPart = parseInt(maxOrderID.substring(1), 10);
        newOrderID = `O${(orderNumberPart + 1).toString().padStart(5, "0")}`;
      }
    }

    // เพิ่มข้อมูลเข้า orders
    await db.query(
      "INSERT INTO orders (Order_ID, HN, Order_Date) VALUES (?, ?, NOW())",
      [newOrderID, HN]
    );

    // สร้าง Treatment_ID ใหม่
    const [maxTreatmentResult] = await db.query(
      "SELECT MAX(Treatment_ID) as maxTreatmentID FROM treatment"
    );
    let newTreatmentID = "T00001"; // กำหนดค่าเริ่มต้นสำหรับ Treatment_ID
    if (maxTreatmentResult[0].maxTreatmentID !== null) {
      const maxTreatmentID = maxTreatmentResult[0].maxTreatmentID;
      if (typeof maxTreatmentID === "string") {
        const treatmentNumberPart = parseInt(maxTreatmentID.substring(1), 10);
        newTreatmentID = `T${(treatmentNumberPart + 1)
          .toString()
          .padStart(5, "0")}`;
      }
    }

    // เพิ่มข้อมูลการรักษาใน treatment โดยใช้ Order_ID
    await db.query(
      `INSERT INTO treatment (Treatment_ID, HN, Order_ID, Treatment_Date, Symptom, Weight, Height, Temp, Pressure, Heart_Rate)
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,

      [
        newTreatmentID,
        HN,
        newOrderID,
        Symptom || null,
        Weight || null,
        Height || null,
        Temp || null,
        Pressure || null,
        Heart_Rate || null,
      ]
    );

    res.status(201).json({
      message:
        "Patient successfully added to walkinqueue with treatment and order.",
      Order_ID: newOrderID,
    });
  } catch (err) {
    console.error("Error adding patient to walkinqueue:", err);
    res.status(500).json({ error: "Error adding patient to walkinqueue" });
  }
});

//เพิ่มการเช็คอิน
app.post("/api/checkInAppointmentQueue", async (req, res) => {
  const { HN, Symptom, Weight, Height, Temp, Pressure, Heart_Rate } = req.body;

  try {
    // ดึงข้อมูล Queue_Time จาก appointmentqueue โดยใช้ HN
    const [appointment] = await db.query(
      "SELECT Queue_Time FROM appointmentqueue WHERE HN = ?",
      [HN]
    );

    if (appointment.length === 0) {
      return res.status(404).json({
        error: "No appointment found for the provided HN.",
      });
    }

    let queueTime = appointment[0].Queue_Time;

    // ดึงเวลาล่าสุดจาก walkinqueue
    const [lastQueue] = await db.query(
      "SELECT Time FROM walkinqueue ORDER BY Time DESC LIMIT 1"
    );

    let newQueueTime = queueTime; // กำหนดค่าเริ่มต้นเป็นเวลาจาก appointmentqueue

    // ตรวจสอบว่ามีคิวใน walkinqueue หรือไม่
    if (lastQueue.length === 0) {
      // ถ้าไม่มีคิวในระบบ ให้กำหนดเวลาเริ่มต้นเป็นเวลาใกล้เคียงกับนาที 00, 15, 30, 45
      let currentTime = new Date();
      const currentMinutes = currentTime.getMinutes();

      // คำนวณเวลาใกล้เคียงกับนาทีที่ลงท้ายด้วย 00, 15, 30, 45
      const nextSlotMinutes = Math.ceil(currentMinutes / 15) * 15;

      // ถ้าเกิน 60 นาที ให้อัพเดตชั่วโมง
      if (nextSlotMinutes === 60) {
        currentTime.setHours(currentTime.getHours() + 1);
        currentTime.setMinutes(0);
      } else {
        currentTime.setMinutes(nextSlotMinutes);
      }

      newQueueTime = currentTime.toTimeString().split(" ")[0];
    } else {
      // ตรวจสอบว่าเวลาล่าสุดใน walkinqueue มีค่าน้อยกว่าเวลานัดหมายหรือไม่
      if (lastQueue.length > 0) {
        let lastQueueTime = new Date(`1970-01-01T${lastQueue[0].Time}`);

        // ถ้าเวลาคิวล่าสุดมากกว่าเวลานัดหมาย ให้แทรกคิวโดยใช้เวลาจาก queueTime และปรับเวลาที่ทับซ้อน
        if (lastQueueTime >= new Date(`1970-01-01T${queueTime}`)) {
          const [conflictingQueue] = await db.query(
            "SELECT * FROM walkinqueue WHERE Time >= ? ORDER BY Time ASC",
            [queueTime]
          );

          // ปรับเวลาคิวที่ทับซ้อน โดยเพิ่มทีละ 15 นาที
          for (let i = 0; i < conflictingQueue.length; i++) {
            const currentQueue = conflictingQueue[i];
            let newTime = new Date(`1970-01-01T${currentQueue.Time}`);
            newTime = new Date(newTime.getTime() + 15 * 60000); // เพิ่ม 15 นาที

            // อัปเดตเวลาของแถวนี้
            await db.query(
              "UPDATE walkinqueue SET Time = ? WHERE Queue_ID = ?",
              [newTime.toTimeString().split(" ")[0], currentQueue.Queue_ID]
            );
          }
        } else {
          // ถ้าเวลาคิวล่าสุดน้อยกว่าเวลานัดหมาย ให้ใช้เวลาคิวล่าสุด + 15 นาที
          newQueueTime = new Date(lastQueueTime.getTime() + 15 * 60000)
            .toTimeString()
            .split(" ")[0];
        }
      }
    }

    // ดึงค่า Queue_ID สูงสุดและเพิ่ม 1
    const [maxQueue] = await db.query(
      "SELECT MAX(Queue_ID) as maxQueueID FROM walkinqueue"
    );
    const newQueueID = maxQueue[0].maxQueueID ? maxQueue[0].maxQueueID + 1 : 1;

    // เพิ่มข้อมูลเข้า walkinqueue พร้อมกับเวลาที่คำนวณแล้ว
    await db.query(
      "INSERT INTO walkinqueue (Queue_ID, HN, Time, Status) VALUES (?, ?, ?, 'รอตรวจ')",
      [newQueueID, HN, newQueueTime]
    );

    // สร้าง Order_ID ใหม่
    const [maxOrderResult] = await db.query(
      "SELECT MAX(Order_ID) as maxOrderID FROM orders"
    );
    let newOrderID = "O00001"; // กำหนดค่าเริ่มต้นสำหรับ Order_ID
    if (maxOrderResult[0].maxOrderID !== null) {
      const maxOrderID = maxOrderResult[0].maxOrderID;
      if (typeof maxOrderID === "string") {
        const orderNumberPart = parseInt(maxOrderID.substring(1), 10);
        newOrderID = `O${(orderNumberPart + 1).toString().padStart(5, "0")}`;
      }
    }

    // เพิ่มข้อมูลเข้า orders
    await db.query(
      "INSERT INTO orders (Order_ID, HN, Order_Date) VALUES (?, ?, NOW())",
      [newOrderID, HN]
    );

    // สร้าง Treatment_ID ใหม่
    const [maxTreatmentResult] = await db.query(
      "SELECT MAX(Treatment_ID) as maxTreatmentID FROM treatment"
    );
    let newTreatmentID = "T00001"; // กำหนดค่าเริ่มต้นสำหรับ Treatment_ID
    if (maxTreatmentResult[0].maxTreatmentID !== null) {
      const maxTreatmentID = maxTreatmentResult[0].maxTreatmentID;
      const treatmentNumberPart = parseInt(maxTreatmentID.substring(1), 10);
      newTreatmentID = `T${(treatmentNumberPart + 1)
        .toString()
        .padStart(5, "0")}`;
    }

    // เพิ่มข้อมูลการรักษาลงในตาราง treatment
    await db.query(
      `INSERT INTO treatment (Treatment_ID, HN, Order_ID, Treatment_Date, Treatment_Details, Treatment_cost, Total_Cost, Symptom, Weight, Height, Temp, Pressure, Heart_Rate)
      VALUES (?, ?, ?, NOW(), NULL, NULL, NULL, ?, ?, ?, ?, ?, ?)
      `,
      [
        newTreatmentID,
        HN,
        newOrderID,
        Symptom || null,
        Weight || null,
        Height || null,
        Temp || null,
        Pressure || null,
        Heart_Rate || null,
      ]
    );

    // ลบข้อมูลออกจาก appointmentqueue หลังจากเช็คอินสำเร็จ
    await db.query("DELETE FROM appointmentqueue WHERE HN = ?", [HN]);

    res.status(201).json({
      message:
        "Patient successfully checked in with updated queue time, treatment, and removed from appointmentqueue.",
      Order_ID: newOrderID,
    });
  } catch (err) {
    console.error("Error checking in patient to walkinqueue:", err);
    res.status(500).json({ error: "Error checking in patient to walkinqueue" });
  }
});

// สำหรับ API เรียกข้อมูลผู้ป่วยพร้อมรายละเอียดการนัดหมาย
app.get("/api/appointmentqueue/details", async (req, res) => {
  const { HN } = req.query;
  if (!HN) {
    return res.status(400).json({ error: "HN is required" });
  }
  try {
    const sql = `
      SELECT a.*, p.*
      FROM appointmentqueue a
      JOIN patient p ON a.HN = p.HN
      WHERE a.HN = ?
    `;
    const [results] = await db.query(sql, [HN]);
    if (results.length > 0) {
      res.json({ data: results });
    } else {
      res.status(404).json({ error: "No patient found with the given HN" });
    }
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//ลบคิว
app.delete("/api/walkinqueue/:HN", async function (req, res) {
  const HN = req.params.HN;
  try {
    const [result] = await db.query("SELECT * FROM walkinqueue WHERE HN = ?", [
      HN,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบ HN ในคิว" });
    }

    await db.query("DELETE FROM walkinqueue WHERE HN = ?", [HN]);
    res.status(200).json({ message: "ลบข้อมูลผู้ป่วยจากคิวสำเร็จ" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//เปลี่ยนสถานะเป็นกำลังตรวจ
app.put("/api/walkinqueue/:HN", async (req, res) => {
  const { HN } = req.params;
  const { Status } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE walkinqueue SET Status = ? WHERE HN = ?",
      [Status, HN]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ป่วยที่ระบุ" });
    }
    res.status(200).json({ message: "อัพเดตสถานะสำเร็จ" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัพเดตสถานะ" });
  }
});

//เพิ่มผู้ป่วย
app.post("/api/addPatientWithDetails", async (req, res) => {
  let {
    Title,
    First_Name,
    Last_Name,
    ID,
    Gender,
    Birthdate,
    Phone,
    Disease,
    Allergy,
    Heart_Rate,
    Pressure,
    Temp,
    Weight,
    Height,
    Symptom,
  } = req.body;

  try {
    // ตรวจสอบค่าว่างและแทนที่ด้วย NULL ถ้าจำเป็น
    Title = Title || null;
    First_Name = First_Name || null;
    Last_Name = Last_Name || null;
    ID = ID || null;
    Gender = Gender || null;
    Birthdate = Birthdate || null;
    Phone = Phone || null;
    Disease = Disease || null;
    Allergy = Allergy || null;
    Heart_Rate = Heart_Rate || null;
    Pressure = Pressure || null;
    Temp = Temp || null;
    Weight = Weight || null;
    Height = Height || null;
    Symptom = Symptom || null;

    // สร้าง HN ใหม่
    const [maxHNResult] = await db.query(
      "SELECT MAX(HN) as maxHN FROM patient"
    );
    let newHN = "HN001";
    if (maxHNResult[0].maxHN !== null) {
      const maxHN = maxHNResult[0].maxHN;
      const numberPart = parseInt(maxHN.substring(2), 10);
      newHN = `HN${(numberPart + 1).toString().padStart(3, "0")}`;
    }

    // เพิ่มข้อมูลในตาราง patient
    const addPatientSql = `
      INSERT INTO patient (HN, Title, First_Name, Last_Name, ID, Gender, Birthdate, Phone, Disease, Allergy) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(addPatientSql, [
      newHN,
      Title,
      First_Name,
      Last_Name,
      ID,
      Gender,
      Birthdate,
      Phone,
      Disease,
      Allergy,
    ]);

    // เพิ่มข้อมูลในตาราง walkinqueue โดยเพิ่มเวลามากสุด + 15 นาที
    const [maxQueueTimeResult] = await db.query(
      "SELECT MAX(Time) as maxTime FROM walkinqueue"
    );

    let newQueueTime = new Date();
    if (maxQueueTimeResult[0].maxTime) {
      const maxTime = new Date(`1970-01-01T${maxQueueTimeResult[0].maxTime}`);
      newQueueTime = new Date(maxTime.getTime() + 15 * 60000); // เพิ่ม 15 นาที
    }

    const formattedQueueTime = newQueueTime.toTimeString().split(" ")[0];

    const addQueueSql =
      "INSERT INTO walkinqueue (HN, Time, Status) VALUES (?, ?, 'รอตรวจ')";
    await db.execute(addQueueSql, [newHN, formattedQueueTime]);

    // เพิ่มข้อมูลในตาราง treatment
    const addTreatmentSql = `
INSERT INTO treatment (Treatment_ID, HN, Symptom, Weight, Height, Temp, Pressure, Heart_Rate, Treatment_Date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
`;

    // ต้องแน่ใจว่า generateID ถูกเรียกใช้เพื่อสร้าง Treatment_ID ใหม่
    const [maxTreatmentResult] = await db.query(
      "SELECT MAX(Treatment_ID) as maxTreatmentID FROM treatment"
    );
    let newTreatmentID = generateID(maxTreatmentResult[0].maxTreatmentID, "T");

    await db.execute(addTreatmentSql, [
      newTreatmentID, // ใช้ Treatment_ID ใหม่ที่สร้างขึ้น
      newHN, // ใช้ HN ของผู้ป่วยใหม่
      Symptom,
      Weight,
      Height,
      Temp,
      Pressure,
      Heart_Rate,
    ]);

    res
      .status(201)
      .json({ message: "เพิ่มผู้ป่วยและข้อมูลที่เกี่ยวข้องสำเร็จ", HN: newHN });
  } catch (error) {
    console.error("Error adding patient with details:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ป่วย" });
  }
});

app.delete("/api/patient/:HN", async function (req, res) {
  const HN = req.params.HN;

  try {
    // ลบข้อมูลในตาราง treatment ที่อ้างอิงถึง HN นี้
    await db.query("DELETE FROM treatment WHERE HN = ?", [HN]);

    // ดึง Order_ID ทั้งหมดที่เกี่ยวข้องกับ HN
    const [orderIdsResult] = await db.query(
      "SELECT Order_ID FROM orders WHERE HN = ?",
      [HN]
    );

    if (orderIdsResult.length > 0) {
      const orderIds = orderIdsResult.map((row) => row.Order_ID);

      // ลบข้อมูลในตาราง order_medicine ที่อ้างอิงถึง Order_ID เหล่านี้
      await db.query("DELETE FROM order_medicine WHERE Order_ID IN (?)", [
        orderIds,
      ]);

      // ลบข้อมูลในตาราง orders ที่เกี่ยวข้องกับ HN
      await db.query("DELETE FROM orders WHERE HN = ?", [HN]);
    }

    // ลบข้อมูลในตาราง walkinqueue ที่อ้างอิงถึง HN นี้
    await db.query("DELETE FROM walkinqueue WHERE HN = ?", [HN]);

    // ลบข้อมูลในตาราง appointmentqueue ที่อ้างอิงถึง HN นี้
    await db.query("DELETE FROM appointmentqueue WHERE HN = ?", [HN]);

    // ลบข้อมูลในตาราง patient
    await db.query("DELETE FROM patient WHERE HN = ?", [HN]);

    res.json({ message: "ลบข้อมูลผู้ป่วยสำเร็จ" });
  } catch (err) {
    console.error("Error deleting patient data:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//ค้นหารายชื่อผู้ป่วย
app.get("/api/patient", function (req, res) {
  const HN = req.query.HN;
  const title = req.query.Title;
  const first_name = req.query.First_Name;
  const last_name = req.query.Last_Name;
  const gender = req.query.Gender;

  let params = [];
  let sql = "SELECT * FROM patient WHERE 1=1";

  if (HN) {
    sql += " AND HN LIKE ?";
    params.push("%" + HN + "%");
  }
  if (title) {
    sql += " AND title LIKE ?";
    params.push("%" + title + "%");
  }
  if (first_name) {
    sql += " AND first_name LIKE ?";
    params.push("%" + first_name + "%");
  }
  if (last_name) {
    sql += " AND last_name LIKE ?";
    params.push("%" + last_name + "%");
  }
  if (gender) {
    sql += " AND gender LIKE ?";
    params.push("%" + gender + "%");
  }

  connection.execute(sql, params, function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ data: results });
  });
});

//เพิ่ม appointments
app.post("/api/appointments", async (req, res) => {
  const { HN, Queue_Date, Queue_Time } = req.body;

  try {
    // ตรวจสอบว่า HN ที่ได้รับมีอยู่ในตาราง patient หรือไม่
    const [rows] = await db.execute("SELECT HN FROM patient WHERE HN = ?", [
      HN,
    ]);
    if (rows.length === 0) {
      return res
        .status(400)
        .json({ message: "ไม่พบ HN ที่ระบุในฐานข้อมูลผู้ป่วย" });
    }

    // เพิ่มข้อมูลนัดหมายใหม่โดยไม่ต้องระบุ Queue_ID
    await db.execute(
      "INSERT INTO appointmentqueue (HN, Queue_Date, Queue_Time) VALUES (?, ?, ?)",
      [HN, Queue_Date, Queue_Time]
    );

    res.status(201).json({ message: "เพิ่มข้อมูลการนัดหมายสำเร็จ" });
  } catch (error) {
    console.error("Error adding appointment:", error);
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลการนัดหมาย" });
  }
});

//แก้ไขข้อมูลผู้ป่วย
app.put("/api/patient/:HN", function (req, res) {
  const HN = req.params.HN;
  const {
    Title,
    First_Name,
    Last_Name,
    Gender,
    Birthdate,
    Phone,
    Disease,
    Allergy,
  } = req.body;

  const birthdate = new Date(Birthdate);
  if (isNaN(birthdate.getTime())) {
    return res.status(400).json({ error: "รูปแบบ Birthdate ไม่ถูกต้อง" });
  }

  const sql =
    "UPDATE patient SET Title = ?, First_Name = ?, Last_Name = ?, Gender = ?, Birthdate = ?, Phone = ?, Disease = ?, Allergy = ? WHERE HN = ?";
  connection.execute(
    sql,
    [
      Title,
      First_Name,
      Last_Name,
      Gender,
      birthdate,
      Phone,
      Disease,
      Allergy,
      HN,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "แก้ไขข้อมูลผู้ป่วยสำเร็จ" });
    }
  );
});

//เพิ่มรายละเอียดรักษากับค่ารักษา
app.post("/api/treatments", async (req, res) => {
  const { HN, treatmentDetails, treatmentCost } = req.body;

  // ตรวจสอบข้อมูลที่รับเข้ามา
  if (!HN || !treatmentDetails || !treatmentCost) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    // คำสั่ง SQL สำหรับเพิ่มข้อมูลการรักษา
    const query = `
      INSERT INTO treatment 
      (HN, Treatment_Details, Treatment_cost, Treatment_Date)
      VALUES (?, ?, ?, NOW())
    `;
    const values = [HN, treatmentDetails, treatmentCost];

    // ดำเนินการคำสั่ง SQL
    const [result] = await db.execute(query, values);

    // ส่งกลับผลลัพธ์เมื่อเพิ่มข้อมูลสำเร็จ
    return res.status(201).json({
      message: "เพิ่มข้อมูลการรักษาสำเร็จ",
      Treatment_ID: result.insertId,
    });
  } catch (error) {
    // ส่งกลับ error หากมีปัญหา
    console.error("Error adding treatment:", error);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลการรักษา" });
  }
});

// ฟังก์ชันดึงข้อมูลผู้ป่วยใหม่ในวันนี้
app.get("/api/new_patients", (req, res) => {
  const sql = `
    SELECT COUNT(DISTINCT w.HN) AS newPatientCount
    FROM walkinqueue w
    JOIN patient p ON w.HN = p.HN
    WHERE DATE(p.created_at) = CURDATE();
  `;

  connection.execute(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ newPatients: results[0].newPatientCount }); // ส่งชื่อให้ตรงกับที่ frontend ใช้
  });
});

// ฟังก์ชันดึงข้อมูลผู้ป่วยเก่าที่จองคิวที่ไม่ใช่วันนี้
app.get("/api/repeat_patients", (req, res) => {
  const sql = `
    SELECT COUNT(DISTINCT w.HN) AS repeatPatientCount
    FROM walkinqueue w
    JOIN patient p ON w.HN = p.HN
    WHERE DATE(p.created_at) != CURDATE();
  `;

  connection.execute(sql, (err, results) => {
    if (err) {
      console.error("Error executing SQL:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      res.json({ repeatPatients: results[0].repeatPatientCount });
    } else {
      res.json({ repeatPatients: 0 });
    }
  });
});

app.put("/api/update_queue_status", (req, res) => {
  const { HN, status } = req.body;

  const sql = `
    UPDATE walkinqueue
    SET Status = ?
    WHERE HN = ? AND Status != 'เสร็จสิ้น'
  `;

  connection.execute(sql, [status, HN], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "อัปเดตสถานะคิวสำเร็จ" });
  });
});

// ฟังก์ชันลบรายการใน walkinqueue ที่ created_at ไม่ตรงกับวันนี้
app.delete("/api/remove_old_queue", (req, res) => {
  const sql = `
    DELETE FROM walkinqueue
    WHERE DATE(created_at) != CURDATE();
  `;

  connection.execute(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "ลบคิวผู้ป่วยที่ไม่ใช่ผู้ป่วยใหม่สำเร็จ" });
  });
});

app.put("/api/medicine_stock/:Medicine_ID", async (req, res) => {
  const { Medicine_ID } = req.params;
  const {
    Medicine_Name,
    Description,
    medicine_type,
    Quantity,
    Quantity_type,
    Med_Cost,
  } = req.body;

  if (
    !Medicine_Name ||
    !Description ||
    !medicine_type ||
    !Quantity ||
    !Quantity_type ||
    !Med_Cost
  ) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const sql = `
      UPDATE medicine 
      SET Medicine_Name = ?, 
          Description = ?, 
          medicine_type = ?, 
          Quantity = ?, 
          Quantity_type = ?, 
          Med_Cost = ?
      WHERE Medicine_ID = ?
    `;
    const values = [
      Medicine_Name,
      Description,
      medicine_type,
      Quantity,
      Quantity_type,
      Med_Cost,
      Medicine_ID,
    ];

    await db.execute(sql, values);

    return res.status(200).json({ message: "อัพเดตข้อมูลยาสำเร็จ" });
  } catch (error) {
    console.error("Error updating medicine:", error);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการอัพเดตข้อมูลยา" });
  }
});

// API สำหรับดึงผู้ป่วยที่นัดหมายวันนี้
app.get("/api/appointmentqueue/today", async (req, res) => {
  const { Queue_Date } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT appointmentqueue.HN, appointmentqueue.Queue_Date, appointmentqueue.Queue_Time, patient.First_Name, patient.Last_Name 
      FROM appointmentqueue 
      JOIN patient ON appointmentqueue.HN = patient.HN 
      WHERE appointmentqueue.Queue_Date = ? 
      ORDER BY appointmentqueue.Queue_Time ASC
      LIMIT 1`,
      [Queue_Date]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ป่วยนัดวันนี้" });
    }

    res.status(200).json(rows); // ส่งผลลัพธ์กลับไปที่ frontend
  } catch (error) {
    console.error("Error fetching today's appointment:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

app.get("/api/patients/total", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM patient");
    res.status(200).json({ total: rows[0].total });
  } catch (error) {
    console.error("Error fetching total patients:", error);
    res.status(500).json({ error: "Error fetching total patients" });
  }
});
app.post('/api/general_treatment', async (req, res) => {
  const { HN, Treatment_Detail, General_Details, Treatment_Others } = req.body;

  if (!HN || !Treatment_Detail || !General_Details || !Treatment_Others) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    await db.query(`
      INSERT INTO general_treatment (HN, Treatment_Detail, General_Details, Treatment_Others)
      VALUES (?, ?, ?, ?)
    `, [HN, Treatment_Detail, General_Details, Treatment_Others]);

    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting into general_treatment:', error);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

app.post('/api/pregnancy_treatment', async (req, res) => {
  const {
    HN,
    Pregnancy_Control_Type,
    Last_Control_Date,
    Freq_Pregnancies,
    Total_Pregnancies,
    Total_Children,
    Last_Pregnancy_Date,
    Abortion_History,
    Pregmed_Detail,
    Preg_Others
  } = req.body;

  try {
    // ดึง Treatment_ID ล่าสุดจากตาราง treatment โดยอิงจาก HN
    const [treatmentRows] = await db.query(
      `
      SELECT Treatment_ID FROM treatment 
      WHERE HN = ? 
      ORDER BY Treatment_ID DESC 
      LIMIT 1
      `,
      [HN]
    );

    // ตรวจสอบว่าพบ Treatment_ID หรือไม่
    if (treatmentRows.length === 0) {
      return res.status(404).json({ error: 'Treatment not found for this HN' });
    }

    const latestTreatmentId = treatmentRows[0].Treatment_ID;

    // Query เพื่อดึง Pregnan_ID ล่าสุด
    const [pregnancyRows] = await db.query(`
      SELECT Pregnan_ID FROM pregnancy_treatment ORDER BY Pregnan_ID DESC LIMIT 1
    `);

    // ใช้ฟังก์ชัน generateID เพื่อสร้าง Pregnan_ID ใหม่
    const newPregnanId = generateID(pregnancyRows[0]?.Pregnan_ID, 'PT');

    // Query สำหรับเพิ่มข้อมูลใน pregnancy_treatment
    await db.query(
      `
      INSERT INTO pregnancy_treatment 
      (Pregnan_ID, Treatment_ID, Pregnancy_Control_Type, Last_Control_Date, Freq_Pregnancies, Total_Pregnancies, Total_Children, Last_Pregnancy_Date, Abortion_History, Pregmed_Detail, Preg_Others)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        newPregnanId, latestTreatmentId, Pregnancy_Control_Type, Last_Control_Date,
        Freq_Pregnancies, Total_Pregnancies, Total_Children,
        Last_Pregnancy_Date, Abortion_History, Pregmed_Detail, Preg_Others
      ]
    );

    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error('Error inserting into pregnancy_treatment:', err);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});


app.listen(5000, function () {
  console.log("port  5000");
});
