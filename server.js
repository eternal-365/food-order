const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to **LOCAL MySQL** instead of Render
const db = mysql.createConnection({
  host: "localhost",  // ✅ Back to localhost
  user: "root",       // ✅ Your local MySQL username
  password: "Yahya@sql20",       // ✅ Your local MySQL password (leave empty if none)
  database: "food_orders", // ✅ Your local database name
  port: 3306          // ✅ Standard MySQL port
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Error:", err);
    return;
  }
  console.log("Connected to Local MySQL Database");
});

// ✅ API to store orders in local MySQL
app.post("/submit-order", (req, res) => {
  const { id, category, items } = req.body;
  if (!id || !items.length) {
    return res.status(400).send({ message: "Invalid data" });
  }

  const values = items.map((item) => [id, category, item.name, item.quantity]);

  const sql = "INSERT INTO orders (lucky_token, category, food_item, quantity) VALUES ?";
  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error inserting order:", err);
      return res.status(500).send({ message: "Error placing order" });
    }
    res.send({ message: `Order placed successfully! Your Lucky Token is ${id}` });
  });
});

// ✅ Start server locally
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
