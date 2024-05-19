import { getDatabase } from "./database";

export const getAllTasks = `SELECT * FROM rippleReminder`;

export const getTaskById = `SELECT * FROM rippleReminder WHERE taskId=?`;

export const createNewTask = `INSERT INTO rippleReminder (taskHeading, taskDescription, status, type, expiry) VALUES (?, ?, ?, ?, ?)`;

export const updateCreatedTask = `UPDATE rippleReminder SET taskHeading = ?, taskDescription = ?, status = ?, type = ?, expiry = ? WHERE taskId = ?`;

export const deleteCreatedTask = `DELETE FROM rippleReminder WHERE taskId=?`;

export const deleteTable = `DROP TABLE rippleReminder`;

export const toggleTaskStatus = `UPDATE rippleReminder set status=? where taskId=?`;

const db = getDatabase();
export const getAllCreatedTasks = async () => {
  if (db) {
    const result = await db.getAllAsync(getAllTasks);
    return result;
  }
  return null;
};

export const getCreatedTaskById = async (id) => {
  if (db) {
    const result = await db.getFirstAsync(getTaskById, id);
    return result;
  }
  return null;
};

export const createANewTask = async (
  taskHeading,
  taskDescription,
  type,
  expiry
) => {
  if (db) {
    await db.runAsync(createNewTask, [
      taskHeading,
      taskDescription,
      "incomplete",
      type,
      expiry,
    ]);
  }
};

export const updateTheTask = async (
  taskHeading,
  taskDescription,
  status,
  type,
  expiry,
  id
) => {
  if (db) {
    await db.runAsync(updateCreatedTask, [
      taskHeading,
      taskDescription,
      status,
      type,
      expiry,
      id,
    ]);
  }
};

export const deleteTheTask = async (taskId) => {
  if (db) {
    await db.runAsync(deleteCreatedTask, taskId);
  }
};

export const toggleTheTaskStatus = async (taskId, status) => {
  if (db) {
    await db.runAsync(toggleTaskStatus, [
      status === "complete" ? "incomplete" : "complete",
      taskId,
    ]);
  }
};
