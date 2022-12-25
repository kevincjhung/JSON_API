// *** LIBRARIES *** 
import * as database from './mysqlDatabaseAsyncAwait.js'
import makeApp from './app.js'


const app = makeApp(database)


// PORT and listen
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})



// const { reject } = require("bcrypt/promises")