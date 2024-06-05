import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from 'dotenv';
import adminModel from '../../Models/Adminmodel.js';
import {adminToken} from '../../Utils/GenerateTokens.js'

dotenv.config();

const saltRounds = 10;

const hashPassword = async (password) => {
    try {
        return await bcryptjs.hash(password, saltRounds);
    } catch (error) {
        throw new Error("Error hashing password");
    }
};

export async function Signup(req, res) {
    try {
        const { username, email, password } = req.body;
        const adminExist = await adminModel.findOne({ email });
        if (adminExist) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const hashedPassword = await hashPassword(password);

        const newAdmin = new adminModel({ email, username, password: hashedPassword, role: "admin" });
        const newUserCreated = await newAdmin.save();

        if (!newUserCreated) {
            return res.status(500).json({ message: "Admin registration failed" });
        }

        res.status(201).json({ message: "Admin signed up successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}



export const Signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await adminModel.findOne({ email }).exec();
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        if (admin.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Not an admin" });
        }

        const isPasswordValid = await bcryptjs.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Pass the entire admin object to adminToken function
        const token = adminToken(admin);
       
        res.cookie("token" , token, { httpOnly: true, maxAge: 86400000 });

        const { _id, username, email: adminEmail, role } = admin;
        return res.status(200).json({
            token,
            user: { _id, username, email: adminEmail, role },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};



export const Signout=(req, res)=> {
    res.clearCookie("token")
    res.status(200).json("signout  Scuccessfully...")
   
    }