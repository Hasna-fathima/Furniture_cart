import express from 'express';
import { connect } from '../config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from '../Routes/user/userRouter.js'
import adminRouter from '../Routes/Admin/adminRouter.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'

const app = express();
const port = process.env.PORT
app.use(cors());
dotenv.config()
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/user',userRouter)
app.use('/api/user/admin', adminRouter)

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });