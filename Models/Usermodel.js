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
      maxLength: 20
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
      minLength: 6
    },
    phoneNumber: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    isBlocked: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });
  
  const userModel = mongoose.model('User', userSchema);
  export default userModel;