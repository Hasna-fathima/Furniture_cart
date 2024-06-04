import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        console.log(req.user.role);
        next();
    });
};

export const authenticateAdmin = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token received in authenticateAdmin:", token); // Log received token

    if (!token) {
        console.error("No token provided in authenticateAdmin");
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.error("Token verification error in authenticateAdmin:", err);
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;
        console.log("User after verification in authenticateAdmin:", req.user); // Log user details

        if (!req.user || req.user.role !== "admin") {
            console.error("User role is not admin or user is undefined in authenticateAdmin:", req.user ? req.user.role : req.user);
            return res.status(403).json({ message: "Not authorized" });
        }

        next();
    });
};




export const requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(400).json({ message: "Authorization required" });
    }
};