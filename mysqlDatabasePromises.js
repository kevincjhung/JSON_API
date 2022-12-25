const mysql = require("mysql2")

const pool = mysql
	.createPool({
		host: "127.0.0.1",
		user: "tasklist_app_user",
		password: "root",
		database: "tasklist_app",
	})
	.promise() // This exposes the promise query functions from the mysql 2 library 


function getTasks() {
	return pool.query(`SELECT * FROM tasks`)
}
exports.getTasks = getTasks


function getTask(id) {
	let query = `
    SELECT * 
    FROM tasks
    WHERE id = ?`

	return pool.query(query, [id])
		.then(tasks => {
			return tasks[0];
		})
}
exports.getTask = getTask


function addTask(title) {
	let query = `
    INSERT INTO tasks (title)
    VALUES ?`;

	return pool.query(query, [title])
		.then(result => {
			const id = result.insertId;
			return pool.query(`SELECT * FROM tasks WHERE id = ?`, [id])
		})

}
exports.addTask = addTask


function updateTask(id, title, completed) {
	let query = `
		UPDATE tasks
		SET 
		title = ?
		completed = ?
		WHERE id = ?`;

	return pool.query(query, [title], [completed], [id])
}
exports.updateTask = updateTask


function deleteTask(id) {
	let query = `
		DELETE FROM tasks 
		WHERE id = '[id]';`

	return pool.query(query, [id], cb);
``}
exports.deleteTask = deleteTask