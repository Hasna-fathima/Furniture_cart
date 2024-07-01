import express from 'express';
import Return from '../../Models/return.js';
import Product from '../../Models/prodectmodel.js';



const Returnorder =async(req,res)=>{
    const { userid, orderid, productid, description } = req.body;

  try {
  
    const product = await Product.findById(productid);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReturn = new Return({
      userid,
      orderid,
      productid,
      description,
      status: 'requested',
    });

    await newReturn.save();
    res.status(201).json({ message: 'Return request submitted successfully', return: newReturn });
  } catch (err) {
    console.error('Error requesting return:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


    
  const returncontroller={Returnorder}
  export default returncontroller
  