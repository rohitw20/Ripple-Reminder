import { getDatabase } from "./database";

export const getAllTasks = `SELECT * FROM rippleReminder`;

export const getTaskById = `SELECT * FROM onetime WHERE taskId=?`;

export const createNewTask = `INSERT INTO rippleReminder (taskHeading, taskDescription, expiry) VALUES (?, ?, ?)`;

export const updateCreatedTask = `UPDATE onetime SET taskHeading = ?, taskDescription = ?, expiry = ? WHERE taskId = ?`;

export const deleteCreatedTask = `DELETE FROM rippleReminder WHERE taskId=?`;

export const deleteTable = `DROP TABLE rippleReminder`;

export const toggleTaskStatus = `UPDATE rippleReminder set status=? where taskId=?`;

const db = getDatabase();
