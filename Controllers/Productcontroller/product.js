import { cloudinaryInstance } from '../../config/Cloudinary.js';
import Product from '../../Models/prodectmodel.js'


// Function to upload image to Cloudinary
 const uploadImageToCloudinary = async (filePath) => {
  try {
    console.log('Starting image upload:', filePath);
    const result = await cloudinaryInstance.uploader.upload(filePath, { folder: 'uploads' });
    console.log('Upload successful:', result);
    
    // Extract public_id from the Cloudinary response
    const publicId = result.public_id;
    console.log('Image Public ID:', publicId);

    return publicId;
  } catch (error) {
    console.error('Error in uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};



// Function to create a new product
 const createProduct = async (req, res) => {
  try {
    const { name, slug, price, category, review, description, quantity } = req.body;

    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const imagePath = req.file.path;
    
    // Upload image to Cloudinary and get the public_id
    const publicId = await uploadImageToCloudinary(imagePath);
    console.log('Upload process finished, public ID:', publicId);

    // Create a new Product object
    const newProduct = new Product({
      name,
      slug,
      price,
      category,
      review,
      description,
      image: req.file.path, // Use req.file.path if needed
      quantity,
      imagePublicId: publicId // Use the publicId obtained from Cloudinary
    });
    console.log('New product object:', newProduct);

    // Save the new product to the database
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
    console.log('')
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateProduct = async (req, res) => {
  try {
    // Access product ID from URL parameters
    const { productId } = req.params;

    // Access other form-data fields from req.body
    const { name, description, price, slug, review, category, quantity } = req.body;

    // Access uploaded image file (if any)
    const uploadedImage = req.file;

    // Find the product by ID
    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product details based on the parsed form-data
    product.name = name;
    product.description = description;
    product.price = price;
    product.slug = slug;
    product.review = review;
    product.category = category;
    product.quantity = quantity;

    // Update image if an image file was uploaded
    if (uploadedImage) {
      const cloudinaryResult = await uploadImageToCloudinary(uploadedImage.path)
      product.image=cloudinaryResult.secure_url // Assuming `path` contains the path to the uploaded image
    }

    // Save the updated product
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
    // Find the product to get the Cloudinary image ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the image from Cloudinary
    const imagePublicId = product.imagePublicId;
    if (imagePublicId) {
      const cloudinaryResult = await cloudinaryInstance.uploader.destroy(imagePublicId);
      console.log('Cloudinary deletion result:', cloudinaryResult);
    }

    // Delete the product from the database
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

const productController={createProduct,getAllProducts,updateProduct,deleteProductById,getProductsByCategoryOrPrice}
export default productController;