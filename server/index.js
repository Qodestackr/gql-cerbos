const express = require('express')
const colors = require('colors')
const cors = require('cors')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

const app = express()

// Connect to database
connectDB()

app.use(cors())
const {Cerbos} = require('cerbos')
const cerbosInstance = new Cerbos({
  hostname: "http://localhost:3592",
})

/**

const permissions = await cerbosInstance.check({
  principal: {
    id: req.user.id,
    roles: req.user.roles,
    attr: req.user
  },
  resource: {
    kind: "project",
    instances: {
      [project.id]: {
        attr: project
      }
    }
  },
  actions: ["update"]
  if(!permissions.isAuthorized(project.id, "update")){
     return res.status(403).json({msg: "forbidden"}) 
  }
  
  await updateProject(project, req.body)
  res.status(200).json({status: "ok", data: project})
*/



app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true //process.env.NODE_ENV === 'development',
  })
)

app.listen(port, console.log(`Server running on port ${port}`))