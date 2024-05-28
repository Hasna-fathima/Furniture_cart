import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv'
dotenv.config()
          
cloudinary.cv2.config({ 
  cloud_name: process.env. cloud_name, 
  api_key: process.env.api_key, 
  api_secret:process.env.api_secret
});