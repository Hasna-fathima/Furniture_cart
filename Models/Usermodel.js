import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        maxLength: 20,
        minLength: 3
    },
    lastname: {
        type: String,
        required: true,
        maxLength: 20,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 20
    },
    email: {                                                                                                                                                                                                                                                           
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6 // Assuming a minimum password length for security
    },
    phoneNumber: {
        type: String, // Change from Number to String for better flexibility
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

export default userModel;