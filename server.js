// LIBRARIES
const express = require("express")
const bodyParser = require("body-parser")

// DATABASE
const mysqlDatabase = require("./mysqlDatabase")
const Database = require('./mysqlDatabase');
const database = new Database();

// EXPRESS
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

// ROUTES
// get all the tasks
app.get("/tasks", (req, res) => {

  let tasks = database.getTasks((error, tasks) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: "cannot get the task" })
      return
    }
  })
  res.status(201).send(tasks);
})

// get single task with id 
app.get("/tasks/:id", (req, res) => {
  const id = +req.params.id;

  let task = database.getTask(id, (error, task) => {
    if (error) {
      console.error(error);
      res.status(404).send({ 'error': 'there is an error' })
      return;
    }

    if (!task) {
      res.status(404).send({ error: `there is no task with id of ${id}` })
    }

  })
  res.status(200).send(task)
})


// create a new task
app.post("/tasks", (req, res) => {

  const title = req.body.title;

  database.addTask(title, (error, task) => {
    // if no title, send back 400 status code
    if (!title.name) {
      console.error(error);
      res.status(400).send({ error: "no title" });
      return;
    }

    res.status(201).send(task);
  })
})


// update or replace a task respond with the task object that was updated
app.put("/tasks/:id", (req, res) => {
  const id = +req.params.id;
  const title = req.body.title
  const completed = req.body.completed;
  // console.log(completed)

  // if client !give 'title' or 'completed', error
  if (!title) {
    res.status(400).send({ "message": "does not contain title" });
    return;
  }

  if (!completed) {
    res.status(400).send({ "message": "does not contain completed" });
    return;
  }

  // if receives id of task that !exist, send back a 404 status code with error message.
  database.getTask(title, (error, task) => {
    if (error || !task) {
      console.error(error);
      res.status(404).send({ message: `there are no tasks with id ${title}` })
      return
    }
  })

  // update the task
  let updatedTask = database.updateTask(id, req.body, completed, (error, task) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: "cannot get the task" })
      return
    }
  })
  res.status(200).send(updatedTask);
})


// delete a single task, When successful, this should respond with nothing 
app.delete("/tasks/:id", (req, res) => {
  const id = +req.params.id;
  // const title = req.body.title;

  // if not given an id
  if (!id) {
    res.status(400).send({ message: "Give a valid id" })
    return
  }

  // if receives id of task that !exist, send back a 404 status code with error message.
  let task = database.getTask(id, (error, task) => {
    if (error) {
      console.error(error);
      res.status(400).end()
      return
    }
  })
  
  if(!task) {
    console.error(error);
      res.status(404).send({ message: `there are no tasks with id ${id}` })
      return
  }
  
  // delete the task
  let deletedTask = database.deleteTask(id, (error, task) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: "cannot get the task" })
      return
    }
  })

  res.status(200).end();
})


// PORT and listen
const port = 8080
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})