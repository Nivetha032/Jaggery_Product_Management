import express from 'express';
import cors from 'cors'
import {adminRouter } from "./Routes/AdminRoute.js";


const app= express()
app.use(cors({
    origin:["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ['GET', 'POST','PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json())
app.use('/auth', adminRouter)
app.use(express.static('Public'))


app.listen(3001,()=>(
    console.log("server running")
))


