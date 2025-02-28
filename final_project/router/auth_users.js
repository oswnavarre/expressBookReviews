const books = require('./booksdb.js')
const jwt = require('jsonwebtoken')
const express = require('express')

const regd_users = express.Router()

const users = []
const SECRET_KEY = 'fingerprint_customer'

const isValid = (username) => {
  return users.some((users) => users.username === username)
}

const authenticatedUser = (username, password) => {
  const user = users.find((users) => users.username === username)
  return user && user.password === password
}

regd_users.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' })
  users.find((u) => u.username === username).token = token
  console.log(users)
  return res.status(200).json({message: "User logged in successfully", token: token})
})

regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params
  const { review } = req.body
  const authHeader = req.header('Authorization')

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const username = decoded.username

    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' })
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {}
    }

    books[isbn].reviews[username] = review
    return res.status(200).json({ message: 'Review added successfully' })
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' })
  }
})


regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const username = decoded.username

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: 'Review not found' })
    }

    delete books[isbn].reviews[username]
    return res.status(200).json({ message: 'Review deleted successfully' })
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
})


module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users