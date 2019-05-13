let router = require('express').Router()
let Inquiries = require('../models/inquiry')

// router.post('*', (req, res, next) => {
//   console.log('Hit the inquiry route')
//   next()
// })

router.get('/', (req, res, next) => {
  Inquiries.find()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(400).send(err)
      next()
    })
})

router.post('/', (req, res, next) => {
  Inquiries.create(req.body)
    .then(newInquiry => {
      res.send(newInquiry)
    })
    .catch(err => {
      res.status(400).send(err)
      next()
    })
})

router.delete('/:id', (req, res, next) => {
  Inquiries.findById(req.params.id)
    .then(inquiry => {
      Inquiries.findByIdAndDelete(req.params.id)
        .then(data => {
          res.send('Inquiry Deleted(KC)')

        })
    })
})

router.delete('/*', (req, res, next) => {
  Inquiries.deleteMany()
    .then(data => {
      res.send('All Inquiries removed!')
    })
})

module.exports = router