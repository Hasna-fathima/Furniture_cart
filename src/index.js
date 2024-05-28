import express from 'express';
import { connect } from '../config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from '../Routes/userRouter.js';
//import { authenticateUser, authenticateAdmin } from '../Middleware/auth.js'; // Importing the middleware functions

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
//app.use(authenticateUser,authenticateAdmin); 
app.use('/api/user', userRouter);

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });