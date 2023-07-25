const express=require('express')
const productController=require('./product.controller.js')
const jwtstrategy=require("../../../middleware/jwtstrategy.js")
const sanitizer=require("../../../middleware/sanitizer.js")
// const multer= require('multer');
const upload=require("../../../awsbucket.js")
// const upload=multer();
const productRouter=express.Router();

// product routes
productRouter.route('/add').post( upload.single('photo'),productController.create)
productRouter.route('/getAllProductList').get(productController.getAllProductList)
productRouter.route('/getAllPhoto').get(productController.getAllPhoto)
productRouter.route('/upload-img').post( upload.array('file', 10), productController.multiplePhotoUpload);
productRouter.route('/update').post(sanitizer(),upload.single("photo"),productController.update)
productRouter.route('/delete').delete(productController.delete)


productRouter.route('/getAllGroceryStaple').get(productController.getAllGroceryStaple)
productRouter.route('/getWebProductById').get(productController.getProductById)
productRouter.route('/list/:slug').get(productController.getProductBySlug)

productRouter.route('/gcatalogsearch/result').get(productController.getProductBySearch)


// aws 

productRouter.route('/aws/delete/photo').post( productController.awsProductPhotoDelete);


module.exports ={productRouter}


