var express = require('express')
var bp = require('body-parser')
var server = express()
var cors = require('cors')
var port = process.env.PORT || 3000

var whiteList = ['http://127.0.0.1:5500', 'https://cormack-loancalculator.herokuapp.com'];
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhiteListed = whiteList.indexOf(origin) !== -1;
    callback(null, originIsWhiteListed);
  },
  credentials: true
};
server.use(express.static(__dirname + '/../client'))
server.use(cors(corsOptions))

//Fire up the database Connection
require('./server-assets/db/mlab-config')

//Register the Middleware
server.use(bp.json())
server.use(bp.urlencoded({
  extended: true
}))

//Routes HERE
let inquiryRoute = require('./server-assets/routes/inquiry')
server.use('/api/inquiries', inquiryRoute)

//Catch All
server.get('*', (req, res, next) => {
  res.status(404).send({
    error: 'No matching routes (KC)'
  })
})

server.listen(port, () => {
  console.log('Server running on port ', port, '(KC)')
})