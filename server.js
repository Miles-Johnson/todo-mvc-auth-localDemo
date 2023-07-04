const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

//Makes app not ugly
app.set('view engine', 'ejs')
app.use(express.static('public'))

//looks at the requests that are coming through. Grabs every single part of the request being made to the server. Can pull stuff out of forms, etc.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//us setting up morgan to run and log everything
app.use(logger('dev'))

// Sessions
//letting our app use the session
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
//letting it know passport is handling autheication
//and that were using sessions along with passport as well
app.use(passport.initialize())
app.use(passport.session())

//flashes alert when things if they go wrong
app.use(flash())
  
//app knows how to handle requests that are coming in
//any requests on route route got to main
//any coming in on todo go to toDoRoutes
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)
 
//if we do push our code to something like heroku, we don't have to worry about having a fixed port
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on ${process.env.PORT}, you better catch it!`)
})    