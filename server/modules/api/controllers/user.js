import User from 'models/user'

export function create(req, res, next) {
  let { username, password, email, address } = req.body

  const user = new User({
    username,
    password,
    email,
    address
  })

  user.save(err => {
    if (err) throw err

    res.json({ success: true })
  })
}

export function list(req, res, next) {
  User.find({}, (err, users) => {
    if (err) throw err

    res.json(users)
  })
}

export function getUser(req, res, next) {
  const username = req.param('username')

  User.findOne({
    username
  }, (err, user) => {
    if (err) throw err

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'No user'
      })
    }

    res.json(user)
  })
}