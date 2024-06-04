
import Category from "../../Models/Category"


export const Createcategory=async(req,res)=>{
    try{
      if(!req.file){
        return res.status(404).json("file is not visible")
      }
        cloudinaryInstance.uploader.upload(req.file.path,async(err,result)=>{
            if(err){
                console.log(err ,"error")
                return res.status(500).json({
                    success:false,
                    message:"error"
                })
              }
        const imgurl=result.url;
        const{name,slug,parentId,createdBy,type}=req.body
        
        const Createcategory=new Category({
          name,
          slug,
          image:imgurl,
          parentId,
          createdBy:req.user._id,

        })
       
        if(!Createcategory){
          return res.status(500).json("category is not created")
        }
        const newcategory= await Createcategory.save();
        res.status(201).json(newcategory)
      })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
    
export const getAllcategory=async(req,res)=>{
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


  export const updatecategory=async(req,res)=>{
    const id=req.params.id;
  
    try {
      const category = await Category.findoneAndUpdate({id:_id},{description,price,title,}, { new: true }
      );
      if (!category) {
        return res.status(404).json({ error: 'category is not updated' });
      }
      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

 
    exports.deletecategoryById = (req, res) => {
      const { categoryId } = req.body.payload;
      if (categoryId) {
        category.deleteOne({ _id: categoryId }).exec((error, result) => {
          if (error) return res.status(400).json({ error });
          if (result) {
            res.status(202).json({ result });
          }
        });
      } else {
        res.status(400).json({ error: "Params required" });
      }
    };


    exports.getcategorysBySlug = (req, res) => {
      const { slug } = req.params;
      Category.findOne({ slug: slug })
        .select("_id type")
        .exec((error, category) => {
          if (error) {
            return res.status(400).json({ error });
          }
    
          if (category) {
            category.find({ category: category._id }).exec((error, categorys) => {
              if (error) {
                return res.status(400).json({ error });
              }
    
              if (category.type) {
                if (categorys.length > 0) {
                  res.status(200).json({
                    categorys,
                    priceRange: {
                      under5k: 5000,
                      under10k: 10000,
                      under15k: 15000,
                      under20k: 20000,
                      under30k: 30000,
                    },
                    categorysByPrice: {
                      under5k: categorys.filter((category) => category.price <= 5000),
                      under10k: categorys.filter(
                        (category) => category.price > 5000 && category.price <= 10000
                      ),
                      under15k: categorys.filter(
                        (category) => category.price > 10000 && category.price <= 15000
                      ),
                      under20k: categorys.filter(
                        (category) => category.price > 15000 && category.price <= 20000
                      ),
                      under30k: categorys.filter(
                        (category) => category.price > 20000 && category.price <= 30000
                      ),
                    },
                  });
                }
              } else {
                res.status(200).json({ categorys });
              }
            });
          }
        });
    };
            
  
    

    
    
    
    
    

  
