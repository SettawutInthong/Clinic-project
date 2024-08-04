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

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

app.post("/clinic/users", function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
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
      res.status(401).json({ error: "Invalid credentials" });
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
    Disease_ID,
    Allergy_ID,
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
        return res.status(500).json({ error: "Reached maximum HN limit" });
      }
      newHN = `HN${nextNumber.toString().padStart(3, "0")}`;
    }

    const addPatient =
      "INSERT INTO patient (HN, Title, First_Name, Last_Name, Gender, Birthdate, Phone, Disease_ID, Allergy_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
        Disease_ID || null,
        Allergy_ID || null,
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
  const { Title, First_Name, Last_Name, Gender, Birthdate, Phone } = req.body;

  const birthdate = new Date(Birthdate);
  if (isNaN(birthdate.getTime())) {
    return res.status(400).json({ error: "Invalid Birthdate format" });
  }

  const sql =
    "UPDATE patient SET Title = ?, First_Name = ?, Last_Name = ?, Gender = ?, Birthdate = ?, Phone = ? WHERE HN = ?";
  connection.execute(
    sql,
    [Title, First_Name, Last_Name, Gender, birthdate, Phone, HN],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "แก้ไขข้อมูลผู้ป่วยสำเร็จ" });
    }
  );
});

//ดึงข้อมูล allergy
app.get("/api/allergy", function (req, res) {
  const sql = "SELECT * FROM allergy";
  connection.execute(sql, function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});

//ดึงข้อมูล diseases
app.get("/api/diseases", function (req, res) {
  const sql = "SELECT * FROM chronic_disease";
  connection.execute(sql, function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});

//เพิ่มคิวผู้ป่วย
app.post("/api/walkinqueue", function (req, res) {
  const { HN } = req.body;

  const getMaxQueueID = "SELECT MAX(Queue_ID) as maxQueueID FROM walkinqueue";
  connection.execute(getMaxQueueID, function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let newQueueID = 1;
    if (results.length > 0 && results[0].maxQueueID !== null) {
      newQueueID = results[0].maxQueueID + 1;
    }

    const addQueue = "INSERT INTO walkinqueue (Queue_ID, HN) VALUES (?, ?)";
    connection.execute(addQueue, [newQueueID, HN], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "เพิ่มผู้ป่วยเข้า walkinqueue สำเร็จ" });
    });
  });
});

//ดึงข้อมูลคิว
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

//ลบคิว
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

// ดึงข้อมูล order
app.get("/api/order_medicine", function (req, res) {
  const HN = req.query.HN;

  const sql = `
    SELECT * FROM order_medicine 
    WHERE HN = ? 
    ORDER BY CAST(SUBSTRING(Order_ID, 2) AS UNSIGNED) DESC 
    LIMIT 1
  `;
  connection.execute(sql, [HN], function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.json({ data: results[0] });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });
});

//--------------------------------------------------------------------------------------------------------------

// API สำหรับค้นหาผู้ป่วย
app.get("/api/patients", (req, res) => {
  const { hn, firstName, lastName } = req.query; // รับค่าจาก query parameters

  let sql = "SELECT * FROM patient WHERE 1=1"; // เริ่มต้นด้วยเงื่อนไขที่เป็นจริงเสมอ
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

// server.js (ส่วนที่เพิ่มเข้ามา)

app.get('/api/disease/:Disease_ID', (req, res) => {
  const diseaseId = req.params.Disease_ID;
  const sql = 'SELECT Disease_name FROM chronic_disease WHERE Disease_ID = ?';
  connection.query(sql, [diseaseId], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json({ diseaseName: results[0].Disease_name });
    } else {
      res.status(404).json({ error: 'Disease not found' });
    }
  });
});


  connection.query(sql, values, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.listen(5000, function () {
  console.log("CORS-enabled web server listening on port 5000");
});
