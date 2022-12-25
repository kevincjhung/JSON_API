import mysql from "mysql2"

const pool = mysql
	.createPool({
		host: "127.0.0.1",
		user: "root",
		password: "root",
		database: "tasklist_app",
	})
	.promise() 
	// This exposes the promise query functions from the mysql 2 library 


export async function getTasks() {
	const [rows] = await pool.query("SELECT * from tasks");
	return rows
}
// exports.getTasks = getTasks


export async function getTask(id) {
	let query = `
		SELECT * 
		FROM tasks
		WHERE id = ?`;

	const [rows] = await pool.query(query, [id]);
	const task = rows[0];
	return task;
}
// exports.getTask = getTask


export async function addTask(title) {
	let query = `
		INSERT INTO tasks (title)
		VALUES (?)`;
	
	const [result] = await pool.query(query, [title]);
	return result;
	// const id = result.insertId;
	// const task = await getTask(id);
}
// exports.addTask = addTask


export async function updateTask(id, title, completed) {
	let query = `
		UPDATE tasks 
		SET
		title = ?,
		completed = ?
		WHERE id = ?
		`;
	
	return await pool.query(query, [title, completed, id]);
}
// exports.updateTask = updateTask


export async function deleteTask(id) {
	let query = `
		DELETE FROM tasks
		WHERE id = ?`;
	
	return await pool.query(query, [id])
}
// exports.deleteTask = deleteTask