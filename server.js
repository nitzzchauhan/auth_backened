import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongodb from "./db/db.js"; 
import userRoutes from "./routes/userRoutes.js"
import morgan from 'morgan'


// variable from env
dotenv.config()
const PORT = process.env.PORT
const mongoURL = process.env.DATABASE_URL
mongodb(mongoURL)



const app = express()

app.use(morgan('dev'));  

app.use(express.json())
app.use('/api/user', userRoutes)






app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})