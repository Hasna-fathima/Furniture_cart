import Category from '../../Models/Category.js'


  const Createcategory = async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);
  
      const { name } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;
  
      if (!name || !image) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const slug = name.toLowerCase().replace(/ /g, '-');
  
      const category = new Category({
        name,
        slug,
        image,
      });
  
      const savedCategory = await category.save();
      res.status(201).send(savedCategory);
    } catch (err) {
      console.error('Error creating category:', err);
      res.status(400).send(err);
    }
  };
  

    
 const getAllcategory=async(req,res)=>{
  try {
      const categorys = await Category.find({});
      if (!categorys) {
        return res.status(404).json({ error: 'categorys are not found' });
      }
      return res.status(200).json(categorys);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


const updatecategory=async(req,res)=>{
  const { id } = req.params;
  const { name, slug } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }

    res.send(category);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}


const deletecategoryById=async(req,res)=>{
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }

    res.send({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

}


        

  const getcategorysBySlug=async(req,res)=>{
    const { slug } = req.params;

    try {
      const category = await Category.findOne({ slug });
  
      if (!category) {
        return res.status(404).send({ message: 'Category not found' });
      }
  
      res.send(category);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
  
  
      
  const categoryController={Createcategory,getAllcategory,getcategorysBySlug,updatecategory,deletecategoryById}
    
export default categoryController
    
    
    
    
    

  
