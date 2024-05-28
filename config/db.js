import  mongoose from'mongoose';
import  dotenv from'dotenv';

dotenv.config();

export const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL );
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to database:", error);
    
    }
};

