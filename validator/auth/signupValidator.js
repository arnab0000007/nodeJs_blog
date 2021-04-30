const { body } = require('express-validator')
const User = require('../../models/User')

module.exports  = [
    body('username')
      .isLength({ min: 2, max: 15 }).withMessage('Username must be Between 2 to 15')
      .custom(async username => {
        let user = await User.findOne({ username })
        if (user) {
          return Promise.reject('Username is Already Used')
        }
      }).trim(),
    body('email')
      .isEmail().withMessage('Please Provide a valid email')
      .custom(async email => {
        let user = await User.findOne({ email })
        if (user) {
          return Promise.reject('Email is Already Used')
        }
      }).trim().normalizeEmail(),
    body('password')
      .isLength({ min: 5 }).withMessage('Password must greater than 5 chars'),
    body('confirmPassword')
      .isLength({ min: 5 }).withMessage('Password must greater than 5 chars')
      .custom((confirmPassword, { req }) => {
  
        if (confirmPassword != req.body.password) {
          throw new Error('Password Did not match')
        }
        return true
  
      })
  ]