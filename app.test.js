import request from "supertest"
import makeApp from "./app.js"
import { jest } from '@jest/globals'

const mockDatabase = {
    getTasks: jest.fn(),
    getTask: jest.fn(),
    addTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn()
}

const app = makeApp(mockDatabase)

// GET individual tasks
describe("GET /tasks/id", () => {
    beforeEach(() => {
        mockDatabase.getTask.mockReset();
    })

    test("getTask is called with the id that we passed into the url", async () => {
        const id = parseInt(Math.random() * 100)
        await request(app).get(`/tasks/${id}`).send()
        expect(mockDatabase.getTask).toHaveBeenLastCalledWith(id)
    })

    test("getTask is called exactly once", async () => {
        const id = parseInt(Math.random() * 100)
        await request(app).get(`/tasks/${id}`).send()
        expect(mockDatabase.getTask).toHaveBeenCalledTimes(1)
    })

    test("responds to the GET request with the task returned from that function", async () => {
        const task = { title: "some task" }
        mockDatabase.getTask.mockResolvedValue(task)
        const response = await request(app).get("/tasks/1").send()
        expect(response.body).toEqual(task)
    })

    test("responds with a 404 status if no task is found", async () => {
        mockDatabase.getTask.mockResolvedValue(null)
        const response = await request(app).get("/tasks/1").send()
        expect(response.statusCode).toEqual(404)
    })

    test("responds with a 500 status if there is a database error", async () => {
        mockDatabase.getTask.mockRejectedValue(new Error())
        const response = await request(app).get("/tasks/1").send()
        expect(response.statusCode).toBe(500)
    })
})

// GET all tasks 
describe("GET /tasks", () => {
    beforeEach(() => {
        mockDatabase.getTasks.mockReset();
    })

    // responds with 500 if there is database error
    test("if database error, should give status code 500", async () => {
        mockDatabase.getTasks.mockRejectedValue(new Error());
        const response = await request(app).get("/tasks").send()
        expect(response.statusCode).toEqual(500)
    })

    // database queried exactly once
    test("getTasks should be called exactly once", async () => {
    
        mockDatabase.getTasks.mockResolvedValue();
        await request(app).get("/tasks").send()
        expect(mockDatabase.getTasks).toHaveBeenCalledTimes(1)
    })

    // TODO: Edit this test, the route works when tested with ThunderClient
    // status should be set to 201 if successful
    // test("Set status to 201 if successful", async () => {
    //     mockDatabase.getTasks.mockResolvedValue(null);
    //     const response = await request(app).get("/tasks").send()
    //     expect(response.statusCode).toEqual(201);
    // })
})

// POST Task (create new task)
describe("POST /tasks", () => {

    beforeEach(() => {
        mockDatabase.addTask.mockReset();
    })

    // SAD ROUTES
    // if no title given, sets status to 400
    test("If no title given, set status to 400", async () => {
        const response = await request(app).post("/tasks").send()
        expect(response.statusCode).toEqual(400)
        expect(mockDatabase.addTask).toHaveBeenCalledTimes(0)
    })

    // function should be called exactly once  
    test("addTask() should be called exactly once given a title", async () => {
        await request(app).post("/tasks").send({"title":"pancakes"}) // do the action
        expect(mockDatabase.addTask).toHaveBeenCalledTimes(1) // did it do the correct action
    })
    // the .send() will be give the body of the post request

    // Correctly catches database error
    test("If database error, should give status code 500", async () => {
        // arrange
        mockDatabase.getTasks.mockRejectedValue(new Error());
        
        // act
        const response = await request(app).get("/tasks").send({"title":"pancakes"})

        // assert
        expect(response.statusCode).toEqual(500)
    })
    // the .send() will be give the body of the post request


    // If success, should give status code 201 
    test("If called successfully, the status code should be set to 201", async () => {
        let body = { "title": "Colors" }
        const response = await request(app).post("/tasks").send(body);
        expect(response.statusCode).toEqual(201);
    })

    test("If called successfully, will respond with the data returned from the database", async () => {
        let body = { "title": "Colors" }
        mockDatabase.addTask.mockResolvedValue({ title: "pancakes" })
        const response = await request(app).post("/tasks").send(body);
        // console.log(response)
        expect(response.body).toEqual({ title: "pancakes" });
    })

    test("if called succesfully will pass the title to teh add task function", async () => {
        let body = { "title": "Colors" }
       await request(app).post("/tasks").send(body);
        expect(mockDatabase.addTask).toHaveBeenLastCalledWith(body.title)
    })

})


// update or replace a task, respond with the task object that was updated
describe("PUT /tasks/id", () => {
    beforeEach(() => {
        mockDatabase.updateTask.mockReset();
    })

    test("If no title or copmleted given, set status to 400", async () => {
        const response = await request(app).put("/tasks/1").send()
        expect(response.statusCode).toEqual(400)
        expect(mockDatabase.updateTask).toHaveBeenCalledTimes(0)
    })

    // responds with 500 status if there is a database error
    test("responds with a 500 status if there is a database error", async () => {
        mockDatabase.updateTask.mockRejectedValue(new Error())
        const response = await request(app).put("/tasks/1").send({
            title: "whatever",
            completed: true
        })
        expect(response.statusCode).toBe(500)
    })

    // function should be called exactly once
    test("`database.updateTask()` should be called exactly once", async () => {
        const id = parseInt(Math.random() * 100)

        await request(app).put(`/tasks/${id}`).send({
            title: "whatever",
            completed: true
        });

        expect(mockDatabase.updateTask).toHaveBeenCalledTimes(1);
    })

    // Calls database.updateTask() with the id passed into the url
    test("calls `database.updateTask()` with the id passed into the url", async () => {
        const id = parseInt(Math.random() * 100)
        await request(app).put(`/tasks/${id}`).send({
            title: "whatever",
            completed: true
        })
        expect(mockDatabase.updateTask).toHaveBeenLastCalledWith(id, "whatever", true)
    })

})


describe("DELETE /tasks/id", () => {
    beforeEach(() => {
        mockDatabase.deleteTask.mockReset();
    })
   
    // responds with 500 status if there is a database error
    test("responds with a 500 status if there is a database error", async () => {
        mockDatabase.deleteTask.mockRejectedValue(new Error())
        const response = await request(app).delete("/tasks/1").send()
        expect(response.statusCode).toBe(500)
    })

    // respond with a 400 if client does not give an id 
    test("responds with a 400 status if no task is found", async () => {
        mockDatabase.deleteTask.mockResolvedValue()
        const response = await request(app).delete("/tasks/0").send()
        expect(response.statusCode).toEqual(400)
    })

    // respond with a 200 if successful
    test("responds with status 201 if successful", async () => {
        mockDatabase.deleteTask.mockResolvedValue()
        const response = await request(app).delete("/tasks/5").send()
        expect(response.statusCode).toEqual(200)
    })

    test("calls the deleteTask() with the correct id", async () => {
        const id = parseInt(Math.random() * 100)
        await request(app).delete(`/tasks/${id}`).send()
        expect(mockDatabase.deleteTask).toHaveBeenLastCalledWith(id)
    })

    test("calls the deleteTask() exactly once", async () => {
        const id = parseInt(Math.random() * 100)
        await request(app).delete(`/tasks/${id}`).send()
        expect(mockDatabase.deleteTask).toHaveBeenCalledTimes(1)

    })
})

