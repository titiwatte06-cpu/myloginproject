import express from 'express'
import cors from 'cors'
import connectDB from '../mongodb/connectDB.js'
import schema from '../data/user.schema.js'
import User from '../data/user.model.js'
import bcrypt from 'bcrypt'

const app = express() 

app.use(cors({
    origin: 'https://myloginproject.vercel.app'
}))

app.use(express.json())



app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body

        const saltrounds = await bcrypt.genSalt();

        // เช็คว่า email ซ้ำไหม
        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' })
        }
        // สร้าง user ใหม่
        // hash password ก่อน
        const passwordHashed = await bcrypt.hash(password, saltrounds)

        // สร้าง user ใหม่ — ใส่ passwordHashed ไม่ใช่ password
        const newUser = new User({ email, password: passwordHashed })
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