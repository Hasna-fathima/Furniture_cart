import { cloudinaryInstance } from '../../config/Cloudinary.js';
import Product from '../../Models/prodectmodel.js';
import Category from '../../Models/Category.js';

// Function to upload image to Cloudinary
export const uploadImageToCloudinary = async (filePath) => {
  
  try {
    console.log('Starting image upload:', filePath);
    const result = await cloudinaryInstance.uploader.upload(filePath, { folder: 'uploads' });
    console.log('Upload successful:', result);
    return result.url;
  } catch (error) {
    console.error('Error in uploading image to Cloudinary:', error);
    throw error;
  }
};

// Function to create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, slug, price, category, review, description, quantity, createdBy} = req.body;
    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const imagePath = req.file.path;
    console.log('Image path:', imagePath);

    const imageUrl = await uploadImageToCloudinary(imagePath);
    console.log('Upload process finished, image URL:', imageUrl);
    // Create a new Product object
    const newProduct = new Product({
      name,
      slug,
      price,
      category,
      review,
      description,
      image:imageUrl,
      quantity,
      createdBy: req.user._id
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



export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { description, price, title } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { description, price, title },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProductById = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const result = await Product.deleteOne({ _id: productId });

    if (!result.deletedCount) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(202).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductsBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const category = await Category.findOne({ slug }).select('_id type');

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const products = await Product.find({ category: category._id });

    if (category.type) {
      const priceRanges = {
        under5k: 5000,
        under10k: 10000,
        under15k: 15000,
        under20k: 20000,
        under30k: 30000,
      };

      const productsByPrice = {
        under5k: products.filter(product => product.price <= 5000),
        under10k: products.filter(product => product.price > 5000 && product.price <= 10000),
        under15k: products.filter(product => product.price > 10000 && product.price <= 15000),
        under20k: products.filter(product => product.price > 15000 && product.price <= 20000),
        under30k: products.filter(product => product.price > 20000 && product.price <= 30000),
      };

      return res.status(200).json({ products, priceRanges, productsByPrice });
    } else {
      return res.status(200).json({ products });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


