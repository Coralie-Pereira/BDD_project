require("dotenv").config();
const { error } = require("node:console");
const { getConnectionDb } = require("../utils/db");
const fs = require("node:fs");

async function initializeDatabase() {
  try {
    const connection = await getConnectionDb()``;
    const schema = fs.readFileSync("db/db.sql", "utf8");

    await connection.query(schema);
    console.log("Succès");
    await connection.end();
  } catch (error) {
    console.error("Une erreur est survenu :", error);
  }
}
initializeDatabase();
