import * as SQLite from "expo-sqlite";
import { todayDate } from "./store";

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
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS dateKeeper (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dailyDate VARCHAR(20) NOT NULL
      )
    `);

    // await db.runAsync(
    //   `INSERT INTO rippleReminder (taskHeading, taskDescription, type, expiry) values(?, ?, ?, ?)`,
    //   ["hello 1", "", "daily", "2024-05-21"]
    // );
    // await db.runAsync(
    //   `INSERT INTO rippleReminder (taskHeading, taskDescription, type, expiry) values(?, ?, ?, ?)`,
    //   ["hello 2", "", "daily", "2024-05-21"]
    // );
    // await db.runAsync(
    //   `INSERT INTO rippleReminder (taskHeading, taskDescription, type, expiry) values(?, ?, ?, ?)`,
    //   ["hello 3", "", "daily", "2024-05-21"]
    // );
    // await db.runAsync(
    //   `INSERT INTO ripplestatus (taskId, status, expiry) values(?, ?, ?)`,
    //   [1, "complete", "2024-05-21"]
    // );

    // const todayDate = `2024-05-21`;

    const row = await db.getAllAsync(`
    SELECT COUNT(*) as count FROM dateKeeper
`);
    if (row[0].count === 0) {
      await db.runAsync(
        `
        INSERT INTO dateKeeper (dailyDate) VALUES(?)
    `,
        todayDate
      );
    }
    // INSERT INTO dateKeeper (dailyDate) SELECT ${todayDate} WHERE (SELECT COUNT(*) FROM dateKeeper)=0
  }
  return db;
};

export const getDatabase = () => db;
