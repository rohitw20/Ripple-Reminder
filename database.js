import * as SQLite from "expo-sqlite";

let db = null;

export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("rippleReminderDb");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS rippleReminder (
        taskId INTEGER PRIMARY KEY AUTOINCREMENT,
        taskHeading VARCHAR(40) NOT NULL,
        taskDescription VARCHAR(500),
        status VARCHAR(20) NOT NULL,
        type VARCHAR(20) NOT NULL,
        expiry VARCHAR(10)
      )
    `);
  }
  return db;
};

export const getDatabase = () => db;
