import express from 'express'
import bodyParser from 'body-parser'

// export default function makeApp (database, defaultFunction)
export default function makeApp(database) {

	// *** EXPRESS ***
	const app = express()
	app.use(express.json())
	app.use(bodyParser.urlencoded({ extended: false }))


	// *** ROUTES ***

	// get all the tasks in array
	app.get("/tasks", async (req, res) => {
		try {
			let tasks = await database.getTasks();

			// if database.getTasks() returns empty array
			if (tasks.length == 0 && Array.isArray(tasks)) {
				res.status(404).send({ error: "there are no tasks to get" })
				return;
			}

			res.status(200).send(tasks);

		} catch (error) {
			console.error(error);
			res.status(500).send({ error: 'cannot get all tasks' })
		}
	})


	// get single task with id 
	app.get("/tasks/:id", async (req, res) => {
		const id = +req.params.id;

		try {
			const tasks = await database.getTask(id);

			if (!tasks) {
				res.status(404).send({ error: "task not found" }).end()
				return;
			}
			res.status(200).send(tasks);

		} catch (error) {
			// console.error(error);
			res.status(500).send({ error: `something went wrong` });
		}
	})


	// create a new task and respond with the task object that was created.
	// if no title, send 400
	app.post("/tasks", async (req, res) => {
		const data = req.body;

		// test if data from req.body is empty object
		let isEmptyObject = Object.keys(data).length === 0;

		if (isEmptyObject) {
			res.status(400).send({ "error": "no title given" }).end()
			return;
		}
		// client did not give JSON with key of "title"
		if (data.title === undefined) {
			res.status(400).send({ "error": "JSON does not have key of `title`" })
			return
		}

		try {
			let taskCreated = await database.addTask(data.title);
			console.log({ taskCreated })
			res.status(201).send(taskCreated);
		} catch (error) {
			console.error(error);
			res.status(400).send({ error: 'no title' })
		}
	})

	// error: program not reading title and SQL command not working
	// update or replace a task, respond with the task object that was updated
	app.put("/tasks/:id", async (req, res) => {
		const id = +req.params.id;
		const title = req.body.title;
		const completed = req.body.completed;


		// if client !give 'title' or 'completed', error
		if (!title) {
			res.status(400).send({ "message": "no title" });
			return;
		}
		if (completed == null) {
			res.status(400).send({ "message": "does not contain completed" });
			return;
		}

		try {
			const task = await database.updateTask(id, title, completed);
			res.status(200).send(task); // write test to see if it is actally passed back to the client
		} catch (error) {
			console.error(error);
			res.status(500).send({ error: "cannot get the task" })
			return;
		}
	})


	// delete a single task, When successful, this should respond with nothing 
	// when db is empty, will return empty array
	app.delete("/tasks/:id", async (req, res) => {
		const id = +req.params.id;

		// if not given an id
		if (!id) {
			res.status(400).send({ message: "Give a valid id" })
			return
		}

		// if receives id of task that !exist, send back a 404 status code with error message.
		try {
			let deletedTask = await database.deleteTask(id);
			console.log(`the task deleted was ${deletedTask}`);
			res.status(200).end();

		} catch (error) {
			console.error(error);
			res.status(500).send({ error: 'cannot delete the task' });
			return
		}
	})


	// single point error handling
	app.use((err, req, res, next) => {
		if (res.headersSent) {
			return next(err)
		}
		console.error(err)
		res.status(500).send({ error: "something bad happened" })
	})

	return app
} 