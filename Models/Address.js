import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 50
  },
  mobileNumber: {
    type: Number,
    required: true,
    trim: true
  },
  pinCode: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true,
    trim: true,
    max: 100
  },
  address: {
    type: String,
    required: true
  },
  cityDistrictTown: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
    max: 100
  },
  alternatePhone: {
    type: Number
  },
  addressType: {
    type: String,
    required: true,
    enum: ["home", "work"]
  }
});

const userAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    address: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address"
    }]
  },
  { timestamps: true }
);

const Address=mongoose.model("Address", addressSchema)

const UserAddress= mongoose.model('UserAddress', userAddressSchema)

export  {UserAddress,Address}