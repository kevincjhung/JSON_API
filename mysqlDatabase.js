const mysql = require("mysql2")

const pool = mysql
	.createPool({
		host: "127.0.0.1",
		user: "tasklist_app_user",
		password: "root",
		database: "tasklist_app",
	})


function getTasks(cb) {
	pool.query(`SELECT * FROM tasks`, (error, tasks) => {
		if(error){
			callback(error, null)
			return
		}

		cb(null, tasks)
	});
}
exports.getTasks = getTasks


function getTask(id, cb) {
	let query = `
		SELECT * 
		FROM tasks
		WHERE id = ?`

	pool.query(query, [id], (error, tasks) => {
		if (error) {
			cb(error)
			return
		}

		cb(null, tasks[0]);
	})
}
exports.getTask = getTask


// after you get the song, pass it back to server.js
function addTask(title, cb) {
	let query = `
		INSERT INTO tasks (title)
		VALUES (?)`;

	pool.query(query, [title], (error, result) => {
		if (error) {
			cb(error)
			return
		}
		const id = result.insertId;

		getTask(id, cb)
	})
}
exports.addTask = addTask


function updateTask(id, title, completed, cb) {
	let query = `
		UPDATE tasks
		SET 
		'title' = ?
		'completed' = ?
		WHERE id = ?`;

	pool.query(query, [title], [completed], [id], (error, tasks) => {
		if (error) {
			cb(error);
			return;
		}
		cb(null, tasks[0]); // return the task that you updated
	})
}
exports.updateTask = updateTask


function deleteTask(id, cb) {
	let query = `
		DELETE FROM tasks 
		WHERE id = '[id]';`

	pool.query(query, [id], cb)
}
exports.deleteTask = deleteTask