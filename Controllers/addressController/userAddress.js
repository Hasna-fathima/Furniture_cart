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

    // Validate user ID and address ID
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ error: 'Invalid user ID or address ID' });
    }

    // Find the UserAddress document
    const userAddress = await UserAddress.findOne({ user: userId });
    if (!userAddress) {
      return res.status(404).json({ error: 'User address not found' });
    }

    // Fetch the address document from the Address collection
    const addressToUpdate = await Address.findById(addressId);
    if (!addressToUpdate) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Update specific fields of the address
    for (const key in updates) {
      addressToUpdate[key] = updates[key];
    }

    // Save changes to the address document
    await addressToUpdate.save();

    res.status(200).json(addressToUpdate);
  } catch (error) {
    console.error('Error updating user address:', error);
    res.status(500).json({ error: 'Error updating user address' });
  }
};




// Get all user addresses
 const getAllUserAddresses = async (req, res) => {
  try {
    const userAddresses = await Address.find();
    res.json(userAddresses);
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({ error: 'Error fetching user addresses' });
  }
};




// Get user address by ID
 const getUserAddressById = async (req, res) => {
  try {
    // Extract userId from request parameters
    const { userId } = req.params;

    // Check if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find addresses associated with the user ID
    const addresses = await UserAddress.find({ user: userId });

    // Send the addresses in the response
    res.status(200).json(addresses);
  } catch (error) {
    // Handle any errors and send an error response
    console.error('Error fetching user addresses:', error);
    res.status(500).json({ error: 'Error fetching user addresses' });
  }
}





// Delete user address by ID
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