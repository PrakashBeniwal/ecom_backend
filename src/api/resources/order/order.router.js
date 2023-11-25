const express=require('express')
const orderController=require('./order.controller.js');
const { jwtstrategy, customerjwt } = require('../../../middleware/strategy.js');
const orderRouter=express.Router();

orderRouter.route('/create').post(customerjwt,orderController.index)
orderRouter.route('/count').get(/*jwtstrategy,*/orderController.count)
orderRouter.route('/list').get(/*jwtstrategy,*/orderController.list)
orderRouter.route('/list').post(customerjwt,orderController.listById)
orderRouter.route('/status/update').post(jwtstrategy,orderController.update)
orderRouter.route('/status').post(jwtstrategy,orderController.status)

module.exports ={orderRouter}