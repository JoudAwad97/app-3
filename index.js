const express = require("express");
const axios = require("axios");
const mysql = require("mysql");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

const dbConfig = {
  host: "database-1.cpgwvhcnpddn.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "password",
  port: 3306,
  database: "db_default",
};

let connection;

const pool = new Pool({
  user: "postgres",
  host: "db-test.cpgwvhcnpddn.us-east-2.rds.amazonaws.com",
  database: "dev_db",
  password: "password",
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("Welcome to the Home page of package 3!");
});

app.get("/db/req", (req, res) => {
  res.status(200).json({
    headers: req.headers,
  });
});

app.get("/db/env-variables", (req, res) => {
  res.send(process.env);
});

app.get("/db/postgres", async (req, res) => {
  pool.connect((err, client, release) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    console.log("Connected to PostgreSQL database!");

    // Release the client when you're finished with it
    release();
    return res.status(200).json({ message: "connected successfully" });
  });
});

app.get("/db/verify-connection", (req, res) => {
  connection.query("SHOW DATABASES", (err, results) => {
    if (err) {
      console.error("Database connection error:", err);
      return res.status(500).send("Failed to connect to the database");
    }

    res.send("Connected successfully to the database");
  });
});

app.get("/db/dummy", (req, res) => {
  res.json({ message: "Dummy response from package 3!! updated" });
});

app.get("/db/call-endpoint", async (req, res) => {
  try {
    const response = await axios.get("http://app-1.retail-store");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to call endpoint" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!!`);
  try {
    connection = mysql.createConnection(dbConfig);
    // Check if the connection is successful
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to the MySQL database:", err);
      } else {
        console.log("Successfully connected to the MySQL database.");
      }
    });
  } catch (error) {
    console.error("Error starting up the app", error);
  }
});
