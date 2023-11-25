const express=require('express')
const locationController=require('./location.controller.js')
const jwtstrategy=require("../../../middleware/jwtstrategy_x.js")
const {sanitize}=require("../../../middleware/sanitizer.js")
const multer= require('multer');

const upload=multer();
const locationRouter=express.Router();

// location routes
locationRouter.route('/create').post(locationController.create)
locationRouter.route('/list').get(locationController.getLocationList)
locationRouter.route('/update').post(locationController.update)
locationRouter.route('/delete').delete(locationController.delete)

// Area routes
locationRouter.route('/area/create').post(locationController.createArea)
locationRouter.route('/area/getAllAreaList').get(locationController.getAreaList)
locationRouter.route('/area/update').post(locationController.updateArea)
locationRouter.route('/area/delete').delete(locationController.deleteArea)
locationRouter.route('/area/list/getbyid').get(sanitize(),locationController.getAreaListById);

// area list
// /area/list/getbyid

module.exports ={locationRouter}