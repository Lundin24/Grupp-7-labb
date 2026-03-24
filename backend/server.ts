import express from 'express'
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const app = express()
app.use(express.json())

type User = {
 username: string
 password: string
}

let users: User[] = []

//register
app.post('/register', async (req: Request, res: Response) => {
 const { username, password } = req.body

 const userExists = users.find((u) => u.username === username)
 if (userExists) {
  return res.status(400).json({ message: 'This user already exists' })
 }

 const hashedPassword = await bcrypt.hash(password, 10)
 users.push({ username, password: hashedPassword })

 res.json({ message: 'Registered!' })
})

//login
app.post('/login', async (req: Request, res: Response) => {
 const { username, password } = req.body

 const user = users.find((u) => u.username === username)
 if (!user) return res.status(400).json({ message: 'User not found' })

 const Match = await bcrypt.compare(password, user.password)
 if (!Match) return res.status(400).json({ message: 'Wrong password' })

 //skyddat lösenord
 const token = jwt.sign({ username: user.username }, 'secretkey')
 res.json({ message: 'Login successful', token })
})
