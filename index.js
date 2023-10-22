const express = require("express");
const axios = require("axios");
const mysql = require("mysql");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

const dbConfig = {
  host: "dev-catalog.cpgwvhcnpddn.us-east-2.rds.amazonaws.com",
  user: "catalog_user",
  password: "password12345",
  port: 3306,
  database: "catalog",
};

let connection;

const pool = new Pool({
  user: "postgres",
  host: "db-dev.cpgwvhcnpddn.us-east-2.rds.amazonaws.com",
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
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    const currentTime = result.rows[0].now;
    res.send(`Current time in PostgreSQL is: ${currentTime}`);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error fetching data from PostgreSQL");
  }
});

app.get("/db/verify-connection", (req, res) => {
  connection.ping((err) => {
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
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to the database:", err);
      } else {
        console.log("Connected to the database successfully.");
      }
    });
  } catch (error) {
    console.error("Error starting up the app", error);
  }
});
