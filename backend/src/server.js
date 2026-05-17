import express from 'express'
import connectDB from '../mongodb/connectDB.js'
import schema from '../data/user.schema.js'
import User from '../data/user.model.js'

const app = express() 

app.use(express.json())

app.get('/login')

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body

        // เช็คว่า email ซ้ำไหม
        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        // สร้าง user ใหม่
        const newUser = new User({ email, password })
        await newUser.save()

        res.status(201).json({ message: 'Register successful' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error', err })
    }
})

app.post('/login',async (req, res) => {
    try {
        const { email, password } = req.body  // รับข้อมูลจาก frontend

        // หา user จาก DB
        const user = await User.findOne({ email, password })

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        res.status(200).json({ message: 'Login successful', user })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error', err })
    }
})

const PORT = 3000;

app.listen(PORT,() => console.log("running"))