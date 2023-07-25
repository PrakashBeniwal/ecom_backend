const express=require('express')
const vendorController=require('./vendor.controller.js')
const jwtstrategy=require("../../../middleware/jwtstrategy.js")
const sanitizer=require("../../../middleware/sanitizer.js")
const multer= require('multer');

const upload=multer();
const vendorRouter=express.Router();


vendorRouter.route('/shop-create').post( vendorController.index);
vendorRouter.route('/list').get( vendorController.getAllvendor);
vendorRouter.route('/product-list').get(vendorController.getAllVendorProduct);
vendorRouter.route('/product/getAllProductById').post(vendorController.getProductByVendor);
vendorRouter.route('/update').post(vendorController.vendorUpdate);
vendorRouter.route('/delete').delete(vendorController.vendorDelete);
vendorRouter.route('/product-delete').post(vendorController.vendorProductDelete);
vendorRouter.route('/product-add').post(vendorController.vendorAddProduct);


module.exports ={vendorRouter}