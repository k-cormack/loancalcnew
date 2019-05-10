let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let schema = new Schema({
  created: {
    type: Date,
    default: Date.now()
  },
  amount: {
    type: Number,
    rquired: true
  },
  inquiryNumber: {
    type: Number,
    required: true
  },
  interest: {
    type: Number,
    required: true
  },
  monthlyPayment: {
    type: Number,
    required: true
  },
  totalInterest: {
    type: Number,
    required: true
  },
  totalPayment: {
    type: Number,
    required: true
  },
  years: {
    type: Number,
    required: true
  },
})

module.exports = mongoose.model('Inquiry', schema)