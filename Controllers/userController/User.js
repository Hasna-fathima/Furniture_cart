import userModel from '../../Models/Usermodel.js'
import bcryptjs from 'bcryptjs';
import {generateToken} from '../../Utils/GenerateTokens.js'

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
        console.log(req.body);

        const { firstname, lastname, username, email, password, phoneNumber } = req.body;
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).send("User already exists");
        }

        const hashedPassword = await hashPassword(password);
        console.log("hashed password is", hashedPassword);

        const newUser = new userModel({ email, firstname, lastname, username, password: hashedPassword, phoneNumber });
        console.log('new user object', newUser);
        const newUserCreated = await newUser.save();
        console.log("new user is created", newUserCreated);

        if (!newUserCreated) {
            return res.status(500).json("User creation failed");
        }
   
        res.status(201).json("Signed up successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json("Server error");
    }
};



export async function Signin(req, res) {
    try {
        const { email, password } = req.body;
        const userExist = await userModel.findOne({ email });
        if (!userExist) {
            return res.json("User does not exist");
        }

        const matchPassword = await bcryptjs.compare(password, userExist.password);
        if (!matchPassword) {
            return res.json("Password is not correct");
        }

        var token = generateToken(email);
        res.cookie("token",token);
        res.json("login sucessfull");
        return token
    } catch (error) {
        console.log(error);
        res.status(500).json("Server error");
    }
}