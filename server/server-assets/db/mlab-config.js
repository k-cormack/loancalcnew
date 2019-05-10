var mongoose = require('mongoose')
var connectionString = 'mongodb://loancalcnew:abc789@ds040489.mlab.com:40489/loancalcnew'
var connection = mongoose.connection

mongoose.connect(connectionString, {
  useNewUrlParser: true
})

connection.on('error', err => {
  console.log('ERROR FROM DB ', err)
})

connection.once('open', () => {
  console.log('Connected to DB (KC)')
})