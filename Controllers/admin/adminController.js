import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from 'dotenv';
import adminModel from '../../Models/Adminmodel.js';
import userModel from "../../Models/Usermodel.js";
import {adminToken} from '../../Utils/GenerateTokens.js';
import Order from "../../Models/ordermodel.js";
import mongoose from "mongoose";
import Message from '../../Models/message.js'

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



 const getAllusers = async (req, res) => {
        try {
          const users = await userModel.find();
          console.log('users',users)
          res.status(200).json(users);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
      };


      const getuserbyid=async(req,res)=>{
        try {
            const user = await userModel.findById(req.params.id);
            if (!user) {
                return res.status(404).send('user not found');
            }
            res.status(200).send(user);
        } catch (err) {
            res.status(500).send(err);
        }
    }




 const unblockedusers=async(req,res)=>{
    try {
        const { id } = req.params; // Extract id from req.params
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid user ID format' });
        }
    
        const user = await userModel.findById(id);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        user.isblocked = false;
        await user.save();
    
        res.status(200).json({ message: 'User unblocked successfully' });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
      }
    };

 const blockedusers = async (req, res) => {
        try {
          const { id } = req.params; // Extract id from req.params
      
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
          }
      
          const user = await userModel.findById(id);
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          user.isblocked = true;
          await user.save();
      
          res.status(200).json({ message: 'User blocked successfully' });
        } catch (error) {
          res.status(500).json({ message: 'An error occurred', error });
        }
      };




      const getOrderCountsPerDay = async (req, res) => {
        try {
          const result = await Order.aggregate([
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                totalOrders: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } } // Sort by date
          ]);
      
          res.json(result);
        } catch (err) {
          console.error('Error fetching order counts:', err);
          res.status(500).send('Error fetching order counts');
        }
      };




       const getOrderCountsPerMonth = async (req, res) => {
        try {
          const result = await Order.aggregate([
            {
              $group: {
                _id: { 
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" }
                },
                totalOrders: { $sum: 1 }
              }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } } // Sort by year and month
          ]);
      
          // Format the result to a more readable format
          const formattedResult = result.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            totalOrders: item.totalOrders
          }));
      
          res.json(formattedResult);
        } catch (err) {
          console.error('Error fetching order counts:', err);
          res.status(500).send('Error fetching order counts');
        }
      };


 const getOrderCountsPerYear = async (req, res) => {
        try {
          const result = await Order.aggregate([
            {
              $group: {
                _id: { year: { $year: "$createdAt" } },
                totalOrders: { $sum: 1 }
              }
            },
            { $sort: { "_id.year": 1 } } // Sort by year
          ]);
      
          // Format the result to a more readable format
          const formattedResult = result.map(item => ({
            year: item._id.year,
            totalOrders: item.totalOrders
          }));
      
          res.json(formattedResult);
        } catch (err) {
          console.error('Error fetching order counts:', err);
          res.status(500).send('Error fetching order counts');
        }
      };


      




     const getTotalSalesReport = async (req, res) => {
        try {
          const totalSales = await Order.aggregate([
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$totalAmount" }
              }
            }
          ]);
      
          // If there are no orders, return 0 as total sales
          const totalAmount = totalSales.length > 0 ? totalSales[0].totalAmount : 0;
      
          res.json({ totalSales: totalAmount });
        } catch (err) {
          console.error('Error generating total sales report:', err);
          res.status(500).send('Error generating total sales report');
        }
      };

   const viewmessage=async(req,res)=>{

        try {
          const message = await Message.find();
          console.log('message',message)
          res.status(200).json(message);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
      };

      const adminController={getAllusers,getOrderCountsPerDay,getOrderCountsPerMonth,getOrderCountsPerYear,blockedusers,unblockedusers,viewmessage,getTotalSalesReport,getuserbyid,}
      
      export default adminController





