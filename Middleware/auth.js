import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader); // Debugging line

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token); // Debugging line

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};


export const adminMiddleware=(req,res,next)=>{
    if(req.user.role !=="admin"){
    return res.ststus(400).json({message:"admin access declained"})
    }

next();
}


export const requireSignin=(req,res,next)=>{
    if(req.headers.authorization){
        const token=req.headers.authorization.split('')[1];
        const user=jwt.verify(token,SECRET_KEY);
        req.user=user;
    }else{
        return res.status(400).json({message:"Authorization required"})
    }
    next()
}