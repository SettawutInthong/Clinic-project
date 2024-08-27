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

//-----------------------------------------------Nurse---------------------------------------------------------------

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

//เพิ่มรายชื่อผู้ป่วย
app.post("/api/patient", function (req, res) {
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

  const getMaxHN = "SELECT MAX(HN) as maxHN FROM patient";
  connection.execute(getMaxHN, function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let newHN = "HN001";
    if (results.length > 0 && results[0].maxHN !== null) {
      const maxHN = results[0].maxHN;
      const numberPart = parseInt(maxHN.substring(2), 10);
      const nextNumber = numberPart + 1;

      if (nextNumber > 999) {
        return res.status(500).json({ error: "ถึงขีดจำกัดของ HN แล้ว" });
      }
      newHN = `HN${nextNumber.toString().padStart(3, "0")}`;
    }

    const addPatient =
      "INSERT INTO patient (HN, Title, First_Name, Last_Name, Gender, Birthdate, Phone, Disease, Allergy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.execute(
      addPatient,
      [
        newHN,
        Title,
        First_Name,
        Last_Name,
        Gender,
        Birthdate,
        Phone,
        Disease || null,
        Allergy || null,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res
          .status(201)
          .json({ message: "เพิ่มรายชื่อผู้ป่วยสำเร็จ", HN: newHN });
      }
    );
  });
});

//ลบรายชื่อผู้ป่วย
app.delete("/api/patient/:HN", function (req, res) {
  const HN = req.params.HN;
  const sql = "DELETE FROM patient WHERE HN = ?";
  connection.execute(sql, [HN], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "ลบข้อมูลผู้ป่วยสำเร็จ" });
  });
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

//ดึงข้อมูลการแพ้ยา (Allergy)
app.get("/api/allergy", function (req, res) {
  const sql = "SELECT * FROM allergy";
  connection.execute(sql, function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});

//ดึงข้อมูลโรคประจำตัว (Diseases)
app.get("/api/diseases", function (req, res) {
  const sql = "SELECT * FROM chronic_disease";
  connection.execute(sql, function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
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

// เพิ่มคิวผู้ป่วย (Walk-In Queue) พร้อมตรวจสอบค่า Order_ID ล่าสุด
app.post("/api/walkinqueue", async function (req, res) {
  const { HN, Heart_Rate, Pressure, Temp, Weight, Height, Symptom } = req.body;

  try {
    // ตรวจสอบค่า Queue_ID ล่าสุด
    const [queueResult] = await db.query(
      "SELECT MAX(Queue_ID) as maxQueueID FROM walkinqueue"
    );
    let newQueueID = 1;
    if (queueResult.length > 0 && queueResult[0].maxQueueID !== null) {
      newQueueID = queueResult[0].maxQueueID + 1;
    }

    // ตรวจสอบค่า Order_ID ล่าสุด
    const [orderResult] = await db.query(
      "SELECT MAX(Order_ID) as maxOrderID FROM orders"
    );
    let newOrderID;
    if (orderResult.length > 0 && orderResult[0].maxOrderID !== null) {
      const currentMaxID = orderResult[0].maxOrderID;
      const nextNumber = parseInt(currentMaxID.substring(1), 10) + 1; // แยกหมายเลขและเพิ่มค่า
      newOrderID = `O${nextNumber.toString().padStart(5, "0")}`; // สร้าง Order_ID ใหม่
    } else {
      newOrderID = "O00001"; // กำหนดค่าเริ่มต้นถ้าไม่มีข้อมูล
    }

    // เพิ่มข้อมูลในตาราง orders ด้วยค่า Order_ID ใหม่
    await db.query(
      "INSERT INTO orders (Order_ID, HN, Order_Date) VALUES (?, ?, NOW())",
      [newOrderID, HN]
    );

    // เพิ่มข้อมูลในตาราง walkinqueue
    await db.query("INSERT INTO walkinqueue (Queue_ID, HN) VALUES (?, ?)", [
      newQueueID,
      HN,
    ]);

    // เพิ่มข้อมูลการรักษาในตาราง treatment
    const [maxTreatmentResult] = await db.query(
      "SELECT MAX(Treatment_ID) as maxTreatmentID FROM treatment"
    );
    const newTreatmentID = generateID(
      maxTreatmentResult[0].maxTreatmentID,
      "T"
    );

    await db.query(
      `INSERT INTO treatment (Treatment_ID, HN, Order_ID, Treatment_Date, Treatment_Details, Treatment_cost, Total_Cost, Symptom, Weight, Height, Temp, Pressure, Heart_Rate)
   VALUES (?, ?, ?, NOW(), NULL, NULL, NULL, ?, ?, ?, ?, ?, ?)`,
      [
        newTreatmentID,
        HN,
        newOrderID,
        Symptom,
        Weight,
        Height,
        Temp,
        Pressure,
        Heart_Rate,
      ]
    );

    res.status(201).json({
      message: "เพิ่มผู้ป่วยเข้า walkinqueue และสร้างข้อมูลการรักษาสำเร็จ",
    });
  } catch (err) {
    console.error("Error adding to queue or creating treatment:", err);
    res
      .status(500)
      .json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ป่วยหรือการรักษา" });
  }
});

//ดึงข้อมูลคิวผู้ป่วย (Walk-In Queue)
app.get("/api/walkinqueue", function (req, res) {
  const sql = `
    SELECT w.Queue_ID, w.HN, p.Title, p.First_Name, p.Last_Name, p.Gender
    FROM walkinqueue w
    JOIN patient p ON w.HN = p.HN
  `;
  connection.execute(sql, function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});

//ลบคิวผู้ป่วยออกจากคิว (Walk-In Queue)
app.delete("/api/walkinqueue/:HN", function (req, res) {
  const HN = req.params.HN;
  const sql = "DELETE FROM walkinqueue WHERE HN = ?";
  connection.execute(sql, [HN], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "ลบข้อมูลจาก walkinqueue สำเร็จ" });
  });
});

// ตรวจสอบว่ามี HN ในคิวแล้วหรือไม่
app.get("/api/walkinqueue/:HN", async (req, res) => {
  const { HN } = req.params;
  try {
    const [result] = await db.query("SELECT 1 FROM walkinqueue WHERE HN = ?", [
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

//ดึงข้อมูลโรคตามรหัสโรค (Disease_ID)
app.get("/api/disease/:Disease_ID", function (req, res) {
  const diseaseId = req.params.Disease_ID;
  const sql = "SELECT Disease_name FROM chronic_disease WHERE Disease_ID = ?";
  connection.query(sql, [diseaseId], function (err, results) {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ diseaseName: results[0].Disease_name });
    } else {
      res.status(404).json({ error: "ไม่พบข้อมูลโรค" });
    }
  });
});

// ดึงข้อมูลAllergyตามAllergy_ID (Allergy_ID)
app.get("/api/allergy/:Allergy_ID", function (req, res) {
  const allergyId = req.params.Allergy_ID;
  const sql = "SELECT allergy_name FROM allergy WHERE Allergy_ID = ?";
  connection.query(sql, [allergyId], function (err, results) {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ allergyName: results[0].allergy_name });
    } else {
      res.status(404).json({ error: "ไม่พบข้อมูลการแพ้" });
    }
  });
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

// generate ID
function generateID(currentMaxID, prefix) {
  if (!currentMaxID) return `${prefix}00001`;
  const nextNumber = parseInt(currentMaxID.substring(1), 10) + 1;
  return `${prefix}${nextNumber.toString().padStart(5, "0")}`;
}

// API เพิ่มการรักษาและสร้าง Order_ID ใหม่
// app.post("/api/treatments", async (req, res) => {
//   const { HN, treatmentDetails, treatmentCost, items } = req.body;
//   const treatmentDate = new Date().toISOString().split("T")[0];

//   try {
//     const [maxTreatmentResult] = await db.query(`
//       SELECT MAX(Treatment_ID) as maxTreatmentID FROM treatment
//     `);
//     const newTreatmentID = generateID(
//       maxTreatmentResult[0].maxTreatmentID,
//       "T"
//     );
//     const [maxOrderResult] = await db.query(`
//       SELECT MAX(Order_ID) as maxOrderID FROM orders
//     `);
//     const newOrderID = generateID(maxOrderResult[0].maxOrderID, "O");
//     await db.query(
//       `
//       INSERT INTO orders (Order_ID, HN, Order_Date)
//       VALUES (?, ?, ?)
//     `,
//       [newOrderID, HN, treatmentDate]
//     );
//     await db.query(
//       `
//       INSERT INTO treatment (Treatment_ID, HN, Treatment_Date, Treatment_Details, Treatment_Cost, Order_ID)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `,
//       [
//         newTreatmentID,
//         HN,
//         treatmentDate,
//         treatmentDetails,
//         treatmentCost,
//         newOrderID,
//       ]
//     );
//     if (items && items.length > 0) {
//       const itemPromises = items.map((item) => {
//         return db.query(
//           `
//           INSERT INTO order_medicine (Order_ID, Medicine_ID, Quantity_Order)
//           VALUES (?, ?, ?)
//         `,
//           [newOrderID, item.Medicine_ID, item.Quantity]
//         );
//       });

//       await Promise.all(itemPromises);
//     }

//     res.json({
//       message: "Treatment, Order, and Medicine Items created successfully",
//       Treatment_ID: newTreatmentID,
//       Order_ID: newOrderID,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

app.get("/api/treatments/latest/:HN", async (req, res) => {
  const { HN } = req.params;
  try {
    const [result] = await connection
      .promise()
      .query(
        "SELECT * FROM treatment WHERE HN = ? ORDER BY Treatment_Date DESC LIMIT 1",
        [HN]
      );
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: "Treatment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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

app.post("/api/orders", async (req, res) => {
  const { HN, Order_ID, items } = req.body;

  const sql = `INSERT INTO orders (Order_ID, HN, Order_Date) VALUES (?, ?, NOW())`;
  await db.execute(sql, [Order_ID, HN]);

  for (const item of items) {
    const { Medicine_ID, Quantity } = item;
    const sqlItem = `INSERT INTO order_medicine (Order_ID, Medicine_ID, Quantity_Order) VALUES (?, ?, ?)`;
    await db.execute(sqlItem, [Order_ID, Medicine_ID, Quantity]);
  }

  res.json({ message: "Order created successfully" });
});

app.listen(5000, function () {
  console.log("port  5000");
});
