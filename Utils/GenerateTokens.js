import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role 
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
};


export const adminToken = (admin) => {
   
    const token = jwt.sign(
        { _id: admin._id, role: admin.role },
        process.env.SECRET_KEY,
        { expiresIn:"1d" }
    );
  return token
};