import express from 'express';
import Product from '../../Models/prodectmodel.js'
import Offer from '../../Models/offer.js';



const createoffers = async (req, res) => {
    
    try {
        const { title, productId, discountPercentage, startDate, endDate } = req.body;
    
        // Normalize dates to only keep date, month, and year
        const startDateNormalized = new Date(startDate);
        startDateNormalized.setHours(0, 0, 0, 0);
    
        const endDateNormalized = new Date(endDate);
        endDateNormalized.setHours(23, 59, 59, 999);
    
    
        if (!req.file) {
          return res.status(400).json({ message: 'Image file is required' });//multer
        }
    
        const offer = new Offer({
          title,
          productId,
          discountPercentage,
          startDate: startDateNormalized,
          endDate: endDateNormalized,
          image: req.file.path 
        });
    
        await offer.save();
    
        const product = await Product.findById(productId);
        if (product) {
          product.hasOffer = true;
          product.discountPercentage = discountPercentage;
          product.image = req.file.path; 
          await product.save();
        }
    
        res.status(201).json({ message: 'Offer created successfully', offer });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
      }
    };
    
      
      
      
  

const getAlloffers=async(req,res)=>{
    try {
        const offers = await Offer.find();
        res.status(200).send(offers);
    } catch (err) {
        res.status(500).send(err);
    }
}


const getOfferbyId=async(req,res)=>{
  const  {Id} =req.params
    try {
        const offer = await Offer.findById(Id);
        if (!offer) {
            return res.status(404).send('Offer not found');
        }
        res.status(200).send(offer);
    } catch (err) {
        res.status(500).send(err);
    }
}


const editOfferbyId=async (req,res)=>{
 
    try {
        const { title, productId, discountPercentage, startDate, endDate } = req.body;
    
      
        const updatedFields = {
          title,
          productId,
          discountPercentage,
          startDate,
          endDate,
          image: req.file ? req.file.path : null // Update image only if a new file is uploaded
        };
    
    
        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    
        if (!updatedOffer) {
          return res.status(404).json({ message: 'Offer not found' });
        }
    
        res.status(200).json({ message: 'Offer updated successfully', offer: updatedOffer });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
      }
    }
    


const deleteOffer= async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).send('Offer not found');
        }
        res.status(200).send('Offer deleted');
    } catch (err) {
        res.status(500).send(err);
    }
}

const Offers={getAlloffers,createoffers,getOfferbyId,editOfferbyId,deleteOffer}
 export default Offers


