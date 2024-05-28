import cloudinaryInstance from 'cloudinary';
import product from '../../Models/prodectmodel';

export const Createproduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(404).json("file is not visible");
    }
    cloudinaryInstance.uploader.upload(req.files[0].path, async (err, result) => {
      if (err) {
        console.log(err, "error");
        return res.status(500).json({
          success: false,
          message: "error"
        });
      }
      const imgurl = result.url;
      const { name, slug, review, description, price, category, quantity, createdBy } = req.body;

      const newProduct = new product({
        name,
        description,
        price,
        slug,
        review,
        quantity,
        image: imgurl,
        category,
        createdBy: req.user._id,
      });

      if (!newProduct) {
        return res.status(500).json("product is not created");
      }
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await product.find({});
    if (!products) {
      return res.status(404).json({ error: 'products are not found' });
    }
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateproduct = async (req, res) => {
  const id = req.params.id;
  const { description, price, title } = req.body;

  try {
    const updatedProduct = await product.findByIdAndUpdate(id, { description, price, title }, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'product is not updated' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProductById = async (req, res) => {
  const { productId } = req.body;
  if (productId) {
    try {
      const result = await product.deleteOne({ _id: productId });
      if (!result) {
        return res.status(400).json({ error: 'Failed to delete product' });
      }
      res.status(202).json({ result });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(400).json({ error: 'Params required' });
  }
};

export const getProductsBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const category = await Category.findOne({ slug }).select('_id type');
    if (category) {
      const products = await product.find({ category: category._id });
      if (category.type) {
        if (products.length > 0) {
          const priceRange = {
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
          res.status(200).json({
            products,
            priceRange,
            productsByPrice,
          });
        }
      } else {
        res.status(200).json({ products });
      }
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
