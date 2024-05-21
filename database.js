import * as SQLite from "expo-sqlite";

let db = null;

export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("ripple");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS rippleReminder (
        taskId INTEGER PRIMARY KEY AUTOINCREMENT,
        taskHeading VARCHAR(40) NOT NULL,
        taskDescription VARCHAR(500), 
        type VARCHAR(20) NOT NULL,
        expiry VARCHAR(10)
      )
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ripplestatus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskId INTEGER NOT NULL, 
        status VARCHAR(20) NOT NULL,
        expiry DATE NOT NULL
      )
    `);
  }
  return db;
};

export const getDatabase = () => db;
