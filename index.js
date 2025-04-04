
import express from 'express';
import connectDB from './db/db.js';
import dotenv from "dotenv";
import cors from "cors"

import userRoutes from './routes/userRoutes.js'
import blogRoutes from './routes/blogRoutes.js'


dotenv.config()

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.json()); 

app.use(express.urlencoded({ extended: true })); 


connectDB();

app.use('/', userRoutes)
app.use('/blog', blogRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
