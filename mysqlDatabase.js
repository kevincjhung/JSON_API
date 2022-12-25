// all code the creates, updates, gets, and deletes tasks should go in this file. 
// This is a fake database, so just manipulate the array.
class Database {
  tasks = [
    {
      id: 1,
      title: "Make vanilla pudding",
      timestamp: Date.now(),
      completed: false
    },
    {
      id: 2,
      title: "Put in mayo jar",
      timestamp: Date.now(),
      completed: false
    },
    {
      id: 3,
      title: "Eat in public",
      timestamp: Date.now(),
      completed: false
    }
  ]

  currentId = 4

  getTasks() {
    return this.tasks
  }

  /**
   * @param {number} id 
   * @returns task with the given id
   */
  getTask(id) {
    return this.tasks.find(task => task.id === id)
  }

  addTask(title) {
    const task = {
      id: this.currentId,
      title,
      timestamp: Date.now(),
      completed: false
    }
    this.currentId++;
    return task
  }

  /***
   * @param {number} id 
   * @param {string} title
   * @param {completed} boolean 
   */
  updateTask(id, title, completed) {
    const task = this.tasks.find(task => task.id === id);
    task.id = id;
    task.title = title;
    task.completed = completed;

    return task
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id)
  }
}
module.exports = Database



