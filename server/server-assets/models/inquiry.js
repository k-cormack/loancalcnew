let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let schema = new Schema({
  created: {
    type: String,
    // default: Date.now()
  },
  amount: {
    type: String,
    rquired: true
  },
  interest: {
    type: String,
    required: true
  },
  monthlyPayment: {
    type: String,
    required: true
  },
  totalInterest: {
    type: String,
    required: true
  },
  totalPayment: {
    type: String,
    required: true
  },
  years: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Inquiry', schema)