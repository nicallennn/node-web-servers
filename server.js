//inport the express module
const express = require('express')
const hbs = require('hbs')
const fs = require('fs')

//get the port from environment variable
const port = process.env.PORT || 3000

//get the express object
let app = express()

//set up partials, passing url of partials dir
hbs.registerPartials(__dirname + '/views/partials')

//set the view engine
app.set('view engine', 'hbs')

app.use((req, res, next) => {                           //use next to tell express to move on
  let now = new Date().toString()
  const log = `${now}: ${req.method} ${req.url}`
  //apend the log to the server.js file
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log!')
    }
  })
  console.log(log)     //log date, http method, and page url
  next()               //call next to move on 
})

//put the app in maintenance mode
// app.use((req, res, next) => {
//   res.render('maintenance.hbs')
// })

//declare static directory
app.use(express.static(__dirname + '/public'))

//create a helper -> this is inserted into footer template
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
})

//set up http route handlers
//http handler for get request -> url, function to run
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the website'
  })
})

//setup another route
app.get('/about', (req, res) => {
  res.render('about.hbs', {       //render the hbs template -> file in 'views' directory (default hbs template dir)
    pageTitle: 'About Page'
  })
})

//projects page
app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page'
  })
})

//help page
app.get('/help', (req, res) => {
  res.render('help.hbs', {
    pageTitle: 'Help Page'
  })
})

app.get('/calc/:op/:num1/:num2', (req, res) => {
  const op = req.params.op
  const num1 = parseInt(req.params.num1)
  const num2 = parseInt(req.params.num2)
  let result = 0

  switch (op) {
    case 'a':
      result = num1 + num2
      break
    case 's':
      result = num1 - num2
      break
    case 'm':
      result = num1 * num2
      break
    case 'd':
      result = num1 / num2
      break
  }

  //return the results object
  res.send({
    op: op,
    num1: num1,
    num2: num2,
    result: result
  })

})


//tell the app to listen on port 3000
app.listen(port, () => {
  console.log(`Server is up an running on port ${port}...`)
})