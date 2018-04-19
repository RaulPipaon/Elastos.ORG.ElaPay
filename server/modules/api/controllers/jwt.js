import jwt from 'jsonwebtoken'

import config from 'config/config'
import User from 'models/user'

export function check(req, res, next) {
  const token = req.body.token || req.param('token') || req.headers['x-access-token']

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'No token provided.'
    })
  }

  jwt.verify(token, config.superSecret, (err, decoded) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Failed to authenticate token.'
      })
    }

    req.decoded = decoded
    next()
  })
}

export function create(req, res, next) {
  const { username, password } = req.body

  // find the user
  User.findOne({
    username
  }, (err, user) => {
    if (err) throw err

    if (!user) {
      return res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      })
    }

    // check if password matches
    if (user.password !== password) {
      return res.json({
        success: false,
        message: 'Authentication failed. Wrong password.'
      })
    }

    // if user is found and password is right
    // create a token
    const payload = {
      admin: user.admin
    }

    const token = jwt.sign(payload, config.superSecret, {
      expiresIn: 86400 // expires in 24 hours
    })

    res.json({
      success: true,
      message: 'Enjoy your token',
      token,
      data: {
        username: user.name
      }
    })
  })
}

export function destroy(req, res, next) {
  const { token } = req.body

  if (token) {
    res.status(200).json({
      success: true
    })
  }
}
