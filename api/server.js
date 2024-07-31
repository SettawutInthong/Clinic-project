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
    return res.status(400).json({ error: "จำเป็นต้องมีชื่อผู้ใช้และรหัสผ่าน" });
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
      res.status(401).json({ error: "ข้อมูลไม่ถูกต้อง" });
    }
  });
});

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

    res.json({
      data: results,
    });
  });
});

app.post("/api/patient", function (req, res) {
  const { Title, First_Name, Last_Name, Gender, Birthdate, Phone } = req.body;

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
      "INSERT INTO patient (HN, Title, First_Name, Last_Name, Gender, Birthdate, Phone) VALUES (?, ?, ?, ?, ?, ?, ?)";
    connection.execute(
      addPatient,
      [newHN, Title, First_Name, Last_Name, Gender, Birthdate, Phone],
      function (err, results) {
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

app.delete("/api/patient/:HN", function (req, res) {
  const HN = req.params.HN;
  const sql = "DELETE FROM patient WHERE HN = ?";
  connection.execute(sql, [HN], function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "ลบข้อมูลผู้ป่วยสำเร็จ" });
  });
});

app.get("/api/patient/:HN", function (req, res) {
  const HN = req.params.HN;
  const sql = "SELECT * FROM patient WHERE HN = ?";
  connection.execute(sql, [HN], function (err, results) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      data: results,
    });
  });
});

app.get("/api/walkinqueue", function (req, res) {
  const queue_id = req.query.Queue_ID;
  const title = req.query.Title;
  const first_name = req.query.First_Name;
  const last_name = req.query.Last_Name;
  const gender = req.query.Gender;

  let params = [];
  let sql = "SELECT * FROM walkinqueue WHERE 1=1";

  if (queue_id) {
    sql += " AND queue_id LIKE ?";
    params.push("%" + queue_id + "%");
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

    res.json({
      data: results,
    });
  });
});

app.listen(5000, function () {
  console.log("CORS-enabled web server listening on port 5000");
});
