import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const generateToken = (req, res, next) => {
    try {
        const token = jwt.sign({ userId: req.user._id }, SECRET_KEY, { expiresIn: "1d" });
        res.locals.token = token; // Attach the token to the response object for later use
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(error); // Pass any errors to the error-handling middleware
    }
};

export const adminToken = (id, role) => {
    try {
        const token = jwt.sign({ data: id, role: role }, SECRET_KEY, { expiresIn: "1d" });
        return token;
    } catch (error) {
        throw new Error('Token generation failed'); // Handle token generation errors
    }
};