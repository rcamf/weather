import * as pw from 'argon2'
import { Router } from "express"
import { Database as db } from "../global"
import { authentication } from "../middleware/authentication"
import { optionalAuthentication } from '../middleware/optional_authentication'

const router = Router()

router.get('/', optionalAuthentication, (req, res) => {
  const usersStmt = db.prepare('SELECT * FROM users')
  try {
    const users = usersStmt.all()
    return res.status(200).send({
      message: 'Users',
      data: users.filter(user => user.public && !(res.locals.user && res.locals.user.id === user.id)).map(user => {
        return {
          surname: user.surname,
          name: user.name,
          username: user.username,
          email: user.email,
          public: user.public === 1,
          followers: user.followers,
          following: user.following
        }
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.get('/:user', optionalAuthentication, (req, res) => {
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  try {
    const user = userStmt.get({
      username: req.params.user
    })
    if (!user || !user.public && !res.locals.user || res.locals.user.id !== user.id) return res.status(404).send({
      message: 'User Not Found'
    })
    return res.status(200).send({
      message: 'User',
      data: {
        surname: user.surname,
        name: user.name,
        username: user.username,
        email: user.email,
        public: user.public === 1,
        followers: user.followers,
        following: user.following
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.put('/:user', authentication, async (req, res) => {
  if (!req.body.type || !['profile', 'password'].includes(req.body.type)) return res.status(400).send({
    message: 'A valid type is required'
  })
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  try {
    let user = userStmt.get({ username: req.params.user })
    if (!user || user.id !== res.locals.user.id) return res.status(404).send({
      message: 'User Not Found'
    })
    if (req.body.type === 'profile') {
      if (!req.body.surname || !req.body.name || !req.body.username || !req.body.email || !req.body.hasOwnProperty('public')) return res.status(400).send({
        message: 'No surname, name, username, email or public provided'
      })
      const updateStmt = db.prepare('UPDATE users SET surname=$surname, name=$name, username=$username, email=$email, public=$public WHERE id=$id')
      const update = updateStmt.run({
        surname: req.body.surname,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        public: req.body.public ? 1 : 0,
        id: res.locals.user.id
      })
      user = userStmt.get({
        username: req.params.user
      })
      return res.status(201).send({
        message: 'Profile Updated',
        data: {
          surname: user.surname,
          name: user.name,
          username: user.username,
          email: user.email,
          public: user.public === 1,
          followers: user.followers,
          following: user.following
        }
      })
    }
    if (req.body.type === 'password') {
      if (!req.body.password || !req.body.old_password) return res.status(400).send({
        message: 'No new password or old password provided'
      })
      const pwCheck = await pw.verify(user.password, req.body.old_password, { type: pw.argon2id })
      if (!pwCheck) return res.status(403).send({
        message: 'Invalid Credentials'
      })
      const updateStmt = db.prepare('UPDATE users SET password=$password WHERE id=$id')
      const pwHash = await pw.hash(req.body.password, { type: pw.argon2id })
      const update = updateStmt.run({
        password: pwHash,
        id: res.locals.user.id
      })
      return res.status(201).send({
        message: 'Password Updated'
      })
    }
  } catch (error) {
    console.log(error)
    if (error.code.includes('UNIQUE')) return res.status(400).send({
      message: 'Username unavailable'
    })
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.get('/:user/endpoints', optionalAuthentication, (req, res) => {
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  const endpointsStmt = db.prepare('SELECT * FROM endpoints WHERE owner_id=$id')
  try {
    const user = userStmt.get({
      username: req.params.user
    })
    if (!user || !user.public && !res.locals.user || res.locals.user.id !== user.id) return res.status(404).send({
      message: 'User Not Found'
    })
    const endpoints = endpointsStmt.all({
      id: user.id
    })
    return res.status(200).send({
      message: 'Endpoints',
      data: res.locals.user && res.locals.user.id === user.id ? endpoints : endpoints.map(endpoint => {
        return {
          id: endpoint.id,
          city: endpoint.city,
          country: endpoint.country,
          owner_id: endpoint.owner_id,
          lat: endpoint.lat,
          long: endpoint.long
        }
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.get('/:user/subscriptions', optionalAuthentication, (req, res) => {
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  const endpointsStmt = db.prepare('SELECT * FROM subscriptions JOIN endpoints ON subscriptions.endpoint_id=endpoints.id WHERE user_id=$id')
  try {
    const user = userStmt.get({
      username: req.params.user
    })
    if (!user || !user.public && !res.locals.user || res.locals.user.id !== user.id) return res.status(404).send({
      message: 'User Not Found'
    })
    const endpoints = endpointsStmt.all({
      id: user.id
    })
    return res.status(200).send({
      message: 'Subscriptions',
      data: res.locals.user && res.locals.user.id === user.id ? endpoints : endpoints.map(endpoint => {
        return {
          id: endpoint.id,
          city: endpoint.city,
          country: endpoint.country,
          owner_id: endpoint.owner_id,
          lat: endpoint.lat,
          long: endpoint.long
        }
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.post('/:user/subscriptions', authentication, (req, res) => {
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  const endpointStmt = db.prepare('SELECT * FROM endpoints WHERE id=$id')
  const subscriptionStmt = db.prepare('INSERT INTO subscriptions (endpoint_id, user_id) VALUES ($endpoint_id, $user_id)')
  try {
    const user = userStmt.get({ username: req.params.user })
    if (!user || user.id !== res.locals.user.id) return res.status(404).send({
      message: 'User Not Found'
    })
    if (!req.body.endpoint) return res.status(400).send({
      message: 'No endpoint provided'
    })
    const endpoint = endpointStmt.get({
      id: req.body.endpoint
    })
    if (!endpoint) return res.status(404).send({
      message: 'Endpoint Not Found'
    })
    const subscription = subscriptionStmt.run({
      endpoint_id: endpoint.id,
      user_id: res.locals.user.id
    })
    return res.status(204).send()
  } catch (error) {
    console.log(error)
    if (error.code.includes('UNIQUE')) return res.status(400).send({
      message: 'Subscription Exists'
    })
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.delete('/:user/subscriptions', authentication, (req, res) => {
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  const endpointStmt = db.prepare('SELECT * FROM endpoints WHERE id=$id')
  const subscriptionStmt = db.prepare('DELETE FROM subscriptions WHERE endpoint_id=$endpoint AND user_id=$user')
  try {
    const user = userStmt.get({ username: req.params.user })
    if (!user || user.id !== res.locals.user.id) return res.status(404).send({
      message: 'User Not Found'
    })
    if (!req.query.id) return res.status(400).send({
      message: 'No endpoint provided'
    })
    const endpoint = endpointStmt.get({
      id: req.query.id
    })
    if (!endpoint) return res.status(404).send({
      message: 'Endpoint Not found'
    })
    const subscription = subscriptionStmt.run({
      endpoint: endpoint.id,
      user: res.locals.user.id
    })
    return res.status(204).send()
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.get('/:user/following', optionalAuthentication, (req, res) => {
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  const followingStmt = db.prepare('SELECT * FROM follows JOIN users ON follows.user_id=users.id WHERE follows.follower_id=$id')
  try {
    const user = userStmt.get({ username: req.params.user })
    if (!user || !user.public) return res.status(404).send({
      message: 'User Not Found'
    })
    const followings = followingStmt.all({ id: user.id })
    return res.status(200).send({
      message: 'Following',
      data: followings.filter(following => following.public || res.locals.user.id && res.locals.user.id === following.id).map(following => {
        return {
          surname: following.surname,
          name: following.name,
          username: following.username,
          email: following.email,
          public: following.public === 1,
          followers: following.followers,
          following: following.following
        }
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.post('/:user/following', authentication, (req, res) => {
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  const followingStmt = db.prepare('INSERT INTO follows (user_id, follower_id) VALUES ($user, $follower)')
  try {
    const follower = userStmt.get({ username: req.params.user })
    if (!follower || follower.id !== res.locals.user.id) return res.status(404).send({
      message: 'User Not Found'
    })
    if (!req.body.user) return res.status(400).send({
      message: 'No user provided'
    })
    const user = userStmt.get({ username: req.body.user })
    if (!user || !user.public) return res.status(404).send({
      message: 'User Not Found'
    })
    const insertion = followingStmt.run({
      user: user.id,
      follower: follower.id
    })
    return res.status(201).send({
      message: 'You now follow ' + user.username
    })
  } catch (error) {
    console.log(error)
    if (error.code.include('UNIQUE')) return res.status(409).send({
      message: 'You already follow the provided user'
    })
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.delete('/:user/following', authentication, (req, res) => {
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  const followingStmt = db.prepare('DELETE FROM follows WHERE user_id=$user_id AND follower_id=$follower_id')
  try {
    const follower = userStmt.get({ username: req.params.user })
    if (!follower || res.locals.user.id !== follower.id) return res.status(404).send({
      message: 'User Not Found'
    })
    if (!req.query.username) return res.status(400).send({
      message: 'No user provided'
    })
    const user = userStmt.get({ username: req.query.username })
    if (!user) return res.status(404).send({
      message: 'User Not Found'
    })
    const deletion = followingStmt.run({
      user_id: user.id,
      follower_id: follower.id
    })
    return res.status(200).send({
      message: 'You unfollowed ' + user.username
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.get('/:user/followers', optionalAuthentication, (req, res) => {
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  const followersStmt = db.prepare('SELECT * FROM follows JOIN users ON follows.follower_id=users.id WHERE follows.user_id=$id')
  try {
    const user = userStmt.get({ username: req.params.user })
    if (!user || !user.public) return res.status(404).send({
      message: 'User Not Found'
    })
    const followers = followersStmt.all({ id: user.id })
    return res.status(200).send({
      message: 'Following',
      data: followers.filter(follower => follower.public || res.locals.user.id && res.locals.user.id === follower.id).map(follower => {
        return {
          surname: follower.surname,
          name: follower.name,
          username: follower.username,
          email: follower.email,
          public: follower.public === 1,
          followers: follower.followers,
          following: follower.following
        }
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

export { router as UserRouter }
