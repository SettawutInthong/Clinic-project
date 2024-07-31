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

// API สำหรับค้นหาผู้ป่วย
app.get('/api/patients', (req, res) => {
  const { hn, firstName, lastName } = req.query; // รับค่าจาก query parameters

  let sql = 'SELECT * FROM patient WHERE 1=1'; // เริ่มต้นด้วยเงื่อนไขที่เป็นจริงเสมอ
  const values = [];

  if (hn) {
    sql += ' AND HN LIKE ?';
    values.push(`%${hn}%`);
  }
  if (firstName) {
    sql += ' AND First_Name LIKE ?';
    values.push(`%${firstName}%`);
  }
  if (lastName) {
    sql += ' AND Last_Name LIKE ?';
    values.push(`%${lastName}%`);
  }

  connection.query(sql, values, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});


app.listen(5000, function () {
  console.log("CORS-enabled web server listening on port 5000");
});
