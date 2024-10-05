const Blog = require("../models/Blog");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.createBlog = async (req, res) => {
  // console.log('req', req.body);

  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "smartEdu",
    }
  );

  try {
    const blog = await Blog.create({
      title: req.body.title,
      text: req.body.text,
      photoUrl: result.secure_url,
    });
    fs.unlinkSync(req.files.image.tempFilePath);
    res.status(201).json({ message: "Blog oluşturuldu"});
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getAllBlog = async(req,res) => {
    try{
        const blogs = await Blog.find().sort("-createdAt")
        res.status(200).json({message:'Bloglar getirildi', blogs:blogs})
    }catch(error){
        res.status(400).json({message:'Hata' ,error:error})
    }    
}

exports.getABlog = async(req,res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    res.status(200).json({
      blog,
      message: "Blog getirildi",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
}