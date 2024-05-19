export const getAllTasks = `SELECT * FROM rippleReminder`;

export const getTaskById = `SELECT * FROM rippleReminder WHERE taskId=?`;

export const createNewTask = `INSERT INTO rippleReminder (taskHeading, taskDescription, status, type, expiry) VALUES (?, ?, ?, ?, ?)`;

export const updateCreatedTask = `UPDATE rippleReminder SET taskHeading = ?, taskDescription = ?, status = ?, type = ?, expiry = ? WHERE taskId = ?`;

export const deleteTable = `DROP TABLE rippleReminder`;
