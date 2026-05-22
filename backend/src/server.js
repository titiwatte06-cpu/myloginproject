import express from 'express'
import cors from 'cors'
import connectDB from '../mongodb/connectDB.js'
import schema from '../data/user.schema.js'
import User from '../data/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authUser } from '../authmiddleware/auth.js'

const app = express() 

app.use(cors({
    origin: 'https://myloginproject.vercel.app',
    credentials:true
}))

app.use(express.json())



app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body

        

        // เช็คว่า email ซ้ำไหม
        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        const saltrounds = await bcrypt.genSalt();
        // สร้าง user ใหม่
        // hash password ก่อน
        const passwordHashed = await bcrypt.hash(password, saltrounds)

        // สร้าง user ใหม่ — ใส่ passwordHashed ไม่ใช่ password
        const newUser = new User({ email, password: passwordHashed })
        await newUser.save()

        const token = await jwt.sign({ id: newUser._id },process.env.SECRET_KEY,{expiresIn:"7d"})

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 วัน (milliseconds)
        })
        console.log(process.env.SECRET_KEY)
        res.status(201).json({ message: 'Register successful', token })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error', err })
    }
})

app.post('/login',async (req, res) => {
    try {
        const { email, password } = req.body  // รับข้อมูลจาก frontend

        // หา user จาก DB
        const user = await User.findOne({ email }).select('+password')

        console.log(user.password)
        console.log(password)

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        

        const passwordchecked = await bcrypt.compare(password,user.password)

        if (!passwordchecked) return res.status(401).json({ message: 'Invalid email or password' })
        

        const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: '7d' }
        )

        console.log(process.env.SECRET_KEY)

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 วัน (milliseconds)
        })
        console.log(process.env.NODE_ENV)
        res.status(200).json({ message: 'Login successful', user , token})

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error', err })
    }
})



const PORT = 3000;

app.listen(PORT,() => console.log("running"))