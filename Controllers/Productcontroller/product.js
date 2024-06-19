import { cloudinaryInstance } from '../../config/Cloudinary.js';
import Product from '../../Models/prodectmodel.js'


 const uploadImageToCloudinary = async (filePath) => {
  try {
    console.log('Starting image upload:', filePath);
    const result = await cloudinaryInstance.uploader.upload(filePath, { folder: 'uploads' });
    console.log('Upload successful:', result);
    
    const publicId = result.public_id;
    console.log('Image Public ID:', publicId);

    return publicId;
  } catch (error) {
    console.error('Error in uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};







 const createProduct = async (req, res) => {
  try {
    const { name, slug, price, category, review, description, quantity } = req.body;

    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const imagePath = req.file.path;
    
    
    const publicId = await uploadImageToCloudinary(imagePath);
    console.log('Upload process finished, public ID:', publicId);

    const newProduct = new Product({
      name,
      slug,
      price,
      category,
      review,
      description,
      image: req.file.path, 
      quantity,
      imagePublicId: publicId 
    });
    console.log('New product object:', newProduct);
    const savedProduct = await newProduct.save();
    console.log('New product created:', savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Product creation failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};






const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log('products',products)
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateProduct = async (req, res) => {
  try {

    const { productId } = req.params;
    const { name, description, price, slug, review, category, quantity } = req.body;
    const uploadedImage = req.file;
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.name = name;
    product.description = description;
    product.price = price;
    product.slug = slug;
    product.review = review;
    product.category = category;
    product.quantity = quantity;
    
    if (uploadedImage) {
      const cloudinaryResult = await uploadImageToCloudinary(uploadedImage.path)
      product.image=cloudinaryResult.secure_url 
    }

    await product.save();

    res.json({ message: 'Product details and image updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


 const deleteProductById = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
  
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const imagePublicId = product.imagePublicId;
    if (imagePublicId) {
      const cloudinaryResult = await cloudinaryInstance.uploader.destroy(imagePublicId);
      console.log('Cloudinary deletion result:', cloudinaryResult);
    }
    const result = await Product.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product and image deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getProductById=async(req,res)=>{
  const  {Id} =req.params
    try {
        const product = await Product.findById(Id);
        if (!product) {
            return res.status(404).send('product not found');
        }
        res.status(200).send(product);
    } catch (err) {
        res.status(500).send(err);
    }
}


const addMainproduct=async(req,res)=>{

    try {
        const { image } = req.body;
        const mainproduct= new Product({  image });
        const mainproductsaved = await mainproduct.save();
        res.status(201).send(mainproductsaved);
    } catch (err) {
        res.status(400).send(err);
    }
  };
  
      



 const getProductsByCategoryOrPrice = async (req, res) => {
  try {
    const category = req.query.category;
    const price = req.query.price;

    let query = {};

    if (category && !price) {
      query.category = category;
    }

    if (!category && price) {
      query.price = price;
    }

    const products = await Product.find(query);

    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'Products not found' });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const productController={createProduct,addMainproduct,getProductById,getAllProducts,updateProduct,deleteProductById,getProductsByCategoryOrPrice}
export default productController;