
// GET individual tasks
describe("GET /tasks/id", () => {
    mockDatabase.getTask.mockReset();
    
    test("calls `database.getTask()` with the id passed into the url", async () => {
        const id = parseInt(Math.random()*100)
        await request(app).get(`/tasks/${id}`).send()
        expect(mockDatabase.getTask).toHaveBeenCalledTimes(1)
        expect(mockDatabase.getTask).toHaveBeenLastCalledWith(id)
    })
    
    test("responds to the GET request with the task returned from that function", async () => {
        const task = {title: "some task"}
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
    mockDatabase.getTasks.mockReset();
    
    // responds with 404 if no tasks found
    test("responds with a 404 status if no task is found", async () => {
        let emptyArray = [];
        mockDatabase.getTasks.mockResolvedValue(emptyArray);
        const response = await request(app).get("/tasks").send()
        
        expect(response.statusCode).toEqual(404)
    })
    
    // responds with 500 if there is database error
    test("if database error, should give status code 500", async () => {
        mockDatabase.getTasks.mockReset();
        mockDatabase.getTasks.mockRejectedValue();
        const response = await request(app).get("/tasks").send()
        expect(response.statusCode).toEqual(500)
    })
    
    // database queried exactly once
    test("Function should be called exactly once", async () => {
        mockDatabase.getTasks.mockReset();
        mockDatabase.getTasks.mockResolvedValue();
        const response = await request(app).get("/tasks").send()
        expect(mockDatabase.getTasks).toHaveBeenCalledTimes(1)
    })
})

// POST Task (create new task)
describe("POST /tasks", () => {
    mockDatabase.addTask.mockReset();

    // SAD ROUTES
    // if no title given, sets status to 400
    test("If no title given, set status to 400", async () => {
        mockDatabase.addTask();
        const response = await request(app).post("/tasks").send()
        expect(response.statusCode).toEqual(400)
    })

    // function should be called exactly once  
    test("Function should be called exactly once", async () => {
        mockDatabase.addTask.mockResolvedValue();
        
        const response = await request(app).post("/tasks").send()
        expect(mockDatabase.addTask).toHaveBeenCalledTimes(1)
    })

    // Correctly catches database error
    test("If database error, should give status code 500", async () => {
        mockDatabase.getTasks.mockRejectedValue();
        const response = await request(app).get("/tasks").send()
        expect(response.statusCode).toEqual(500)
    })
   
    // HAPPY ROUTES
    // If success, should give status code 201  -------NOT WORKING
    
    test("If called successfully, the status code should be set to 201", async () => {
      
        let title = {"title": "Colors"}
        mockDatabase.addTask.mockResolvedValue(title);
        
        const response = await request(app).post("/tasks").send();
        expect(response.statusCode).toEqual(201);
    })
    
})
