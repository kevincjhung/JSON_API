const express = require("express")
const bodyParser = require("body-parser")

const Database = require('./Database')
const database = new Database()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())


// testing 
app.get("/test", (req, res) => {
  res.send({
    message: "It's working"
  });
})

// get all the tasks
app.get("/tasks", (req, res) => {
  const tasks = database.getTasks();
  res.status(200).send(tasks);
})

// get single task with id
app.get("/tasks/:id", (req, res) => {
  const id = +req.params.id;
  const task = database.getTask(id);
  res.status(201).send(task)
})

// create a new task
app.post("/tasks", (req, res) => {
  const data = req.body;
  console.log(req.body)

  if (!data.title) {
    res.status(404).send('There is no data in the req.body');
    return;
  }

  const task = database.addTask(data.title);

  res.status(201).send(task)
})

// update/replace a task 
// respond with the task object that was updated.
app.put("/tasks/:id", (req, res) => {

  const id = +req.params.id;
  const title = req.body.title;
  const completed = req.body.completed;

  console.log(title, completed)

  if (!id) {
    res.status(400).send({ message: "Give a valid id" })
    return;
  }

  // id, title, completed
  let updatedTask = database.updateTask(id, title, completed);

  res.status(201).send(updatedTask)
})

// delete a single task 
app.delete("/tasks/:id", (req, res) => {
  const id = +req.params.id;
  console.log(id)

  // if not given an id
  if (!id) {
    res.status(400).send({ message: "Give a valid id" })
    return
  }

  database.deleteTask(id);
  res.status(200).end();

  // When successful, this should respond with nothing res.end()
})


const port = 8080
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
