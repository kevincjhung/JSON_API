// LIBRARIES
const express = require("express")
const bodyParser = require("body-parser")

// DATABASE
// const mysqlDatabase = require("./mysqlDatabase")
const mysqlDbPromises = require("./mysqlDatabasePromises")
const { reject } = require("bcrypt-promise")

// EXPRESS
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

// ROUTES

// get all the tasks in array
app.get("/tasks", (req, res) => {
  mysqlDbPromises.getTasks()
    .then((tasks) => {
      res.status(200).send(tasks);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: 'cannot get all of the tasks' });
    })
})


// get single task with id 
app.get("/tasks/:id", (req, res) => {
  const id = +req.params.id;

  mysqlDbPromises.getTask(id)
    .then((task) => {
      res.status(200).send(task)
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send({ error: `there is no task with id: ${id}` })
    })
})


// create a new task 
app.post("/tasks", (req, res) => {
  const data = req.body;
  const title = req.body.title;
  
  let isEmptyObject = Object.keys(data).length === 0;

  // empty req.body
  if(isEmptyObject){ 
    res.status(400).send({"error": "No json given"}).end()
    return;
  } 
  
  // client did not give JSON with key of "title"
  if (title === undefined){
    res.status(400).send({"error":"JSON does not have key of `title`"})
    return
  }

  mysqlDbPromises.addTask(title)
    .then(task => {
      res.status(201).send(task)
    })
    .catch(error => {
      console.error(error);
      res.status(400).send();
      return;
    })
})


// update or replace a task respond with the task object that was updated
app.put("/tasks/:id", (req, res) => {
  const title = req.body.title;
  const id = +req.params.id;
  const completed = req.body.completed;

  // if client !give 'title' or 'completed', error
  if (!title) {
    res.status(400).send({ "message": "does not contain title" });
    return;
  }
  if (completed == undefined) {
    res.status(400).send({ "message": "does not contain completed" });
    return;
  }

  mysqlDbPromises.getTask(id)
    .then(task => {
      if (!task) { reject(); }
    })
    .catch(error => {
      console.error(error);
      res.status(404).send({ message: `there are no tasks with id ${id}` })
    })

  mysqlDbPromises.updateTask(title, completed, id)
    .then((task) => {
      res.status(200).send(task).end();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: "cannot get the task" }).end();
      return;
    })
})


// delete a single task, When successful, this should respond with nothing 
app.delete("/tasks/:id", (req, res) => {
  const id = +req.params.id;

  // if not given an id
  if (!id) {
    res.status(400).send({ message: "Give a valid id" })
    return
  }

  // if receives id of task that !exist, send back a 404 status code with error message
  mysqlDbPromises.getTask(id)
    .then((task) => {
      if (!task) {
        reject();
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send({ message: `there are no tasks with the id: ${id}` });
    })

  // if receives id of task that !exist, send back a 404 status code with error message.
  mysqlDbPromises.deleteTask(id)
    .then((task) => {
      res.end()
    })
    .catch((error) => {
      if (error) {
        console.error(error);
        res.status(500).send({ error: "cannot delete the task" })
        return
      }
    })
})




// PORT and listen
const port = 8080
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
