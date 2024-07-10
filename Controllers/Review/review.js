import Review from "../../Models/review.js";




 const reviewadd= async(req,res)=> {
  try {
    const { userId, productId, rating, comment } = req.body;
    
    if (!userId || !productId || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const review = new Review({
      userId,
      productId,
      rating,
      comment,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

 const getreview=async(req,res)=>{
    try{
        const {productId}=req.params
        const reviews =await Review.find({productId}).populate('userId','name')
        res.status(200).json(reviews)
    } catch (error) {
        console.error('Error getting review:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }


    const ReviewController={reviewadd,getreview}
    export default ReviewController
    
