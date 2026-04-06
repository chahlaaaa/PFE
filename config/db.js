const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "school_app"
});

db.connect(err => {
  if (err) {
    console.log(" Erreur DB:", err.message);
  } else {
    console.log(" DB connected");
  }
});

module.exports = db;