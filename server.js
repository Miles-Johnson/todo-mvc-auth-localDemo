//This line imports the Express module, Express is a framework to handle backend api routes / response / middleware / HTTP(s)
const express = require('express')
//Instansiates the main express function, holds it in a variable to be used later.
const app = express()
const mongoose = require('mongoose')

//Imports passport.js which is a middlewares module for Node.js. that handles authentication and authorization via modular strategies
const passport = require('passport')

//a middleware module in Express. js that allows you to create sessions in your web application. Not for production level enviroments.
const session = require('express-session')

//Express.js middleware that provides session storage using MongoDB as the underlying database
const MongoStore = require('connect-mongo')(session)

///Import for express-flash module which is an extension to render popup messages
const flash = require('express-flash')

//HTTP request logger middleware for node.js. Adds a log down in the terminal in VScode that shows you all the requests.
const logger = require('morgan')

//requiring the database file from our own config. Imports database connection object
const connectDB = require('./config/database')

//imports router object for the main routes '/'
const mainRoutes = require('./routes/main')
//import toDO routes
const todoRoutes = require('./routes/todos')

//Imports dotenv module which iszero dependecny module that loads enviroment variables from an env file. Then runs the config method which loads the enviroment variables from the provideed env file
require('dotenv').config({path: './config/.env'})

// Passport config. Imports local passport config function/object.  

//Then ~~*M A G I C Z*~~
require('./config/passport')(passport)

//executes database connection
connectDB()

//Enables ejs template engine. "Makes app not ugly"
app.set('view engine', 'ejs')
//Express.js application to serve static files from a directory named "public" located in the root of your project.
app.use(express.static('public'))


// middleware functions in Express.js that handle sparsing of incoming request bodies.

///Middleware function to parse url encoded data from request. 
//Extended syntax allows rich objects allowing for a JSON like experience with url encoded data
app.use(express.urlencoded({ extended: true }))
//Middleware function to parse JSON data from request
app.use(express.json())

//us setting up morgan to run and log everything. Has different formats for the amount of data that it logs.
app.use(logger('dev'))

// Sessions
//letting our app use the session
//configure express session middlewares. MIght put in .env
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