import express from 'express';
import  Offer from '../models/Offer';
import Product from '../../../Models/prodectmodel'


 const createoffers=async(req,res)=>{

    try {
        const { name, description, discount, validUntil, Products } = req.body;
        
        // Validate Product IDs
        const validProducts = await Product.find({ '_id': { $in: Products } });
        if (validProducts.length !== Products.length) {
            return res.status(400).send('Some Product IDs are invalid');
        }

        const offer = new Offer({ name, description, discount, validUntil, Products });
        const savedOffer = await offer.save();
        res.status(201).send(savedOffer);
    } catch (err) {
        res.status(400).send(err);
    }
}


const getAlloffers=async(req,res)=>{
    try {
        const offers = await Offer.find();
        res.status(200).send(offers);
    } catch (err) {
        res.status(500).send(err);
    }
}


const getOfferbyId=async(req,res)=>{
    try {
        const offer = await Offer.findById(req.params.id);
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
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!offer) {
            return res.status(404).send('Offer not found');
        }
        res.status(200).send(offer);
    } catch (err) {
        res.status(400).send(err);
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


