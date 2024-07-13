import {Address,UserAddress} from '../../Models/Address.js'
import mongoose from "mongoose";
import userModel from "../../Models/Usermodel.js";



const  createUserAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressDocument = new Address(address)
    const savedAddress = await addressDocument.save()

    const userAddress = new UserAddress({
      user: user._id,
      address: [savedAddress._id]  
    });

    const savedUserAddress = await userAddress.save()

    res.status(201).json({ userAddress: savedUserAddress, address: savedAddress })

  } catch (error) {

    console.error('Error creating user address:', error);

    res.status(500).json({ error: 'Error creating user address' });
  }
};




  
const updateUserAddressById = async (req, res) => {
  try {
    const { userId, addressId, updates } = req.body;

   
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ error: 'Invalid user ID or address ID' });
    }

    const userAddress = await UserAddress.findOne({ user: userId });
    if (!userAddress) {
      return res.status(404).json({ error: 'User address not found' });
    }

    const addressToUpdate = await Address.findById(addressId);
    if (!addressToUpdate) {
      return res.status(404).json({ error: 'Address not found' });
    }
    for (const key in updates) {
      addressToUpdate[key] = updates[key];
    }

    await addressToUpdate.save();

    res.status(200).json(addressToUpdate);
  } catch (error) {
    console.error('Error updating user address:', error);
    res.status(500).json({ error: 'Error updating user address' });
  }
};




 const getAllUserAddresses = async (req, res) => {
  try {
    const userAddresses = await Address.find();
    res.json(userAddresses);
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({ error: 'Error fetching user addresses' });
  }
};



 const getUserAddressById = async (req, res) => {
  try {

    const { userId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const addresses = await UserAddress.find({ user: userId });

    res.status(200).json(addresses);
  } catch (error) {

    console.error('Error fetching user addresses:', error);
    res.status(500).json({ error: 'Error fetching user addresses' });
  }
}





 const deleteUserAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUserAddress = await Address.findByIdAndDelete(id);
    if (!deletedUserAddress) {
      return res.status(404).json({ error: 'User address not found' });
    }
    res.json({ message: 'User address deleted successfully'})
} catch (error) {
    console.error('Error updating user address:', error);
    res.status(500).json({ error: 'Error updating user address' });
  }
};



 const AddressController={createUserAddress,updateUserAddressById,getAllUserAddresses,getUserAddressById,deleteUserAddressById}
 export default AddressController