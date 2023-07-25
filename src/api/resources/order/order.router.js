const express=require('express')
const orderController=require('./order.controller.js')
const jwtstrategy=require("../../../middleware/jwtstrategy.js")

const orderRouter=express.Router();

orderRouter.route('/create').post(orderController.index)
orderRouter.route('/count').get(orderController.count)
orderRouter.route('/list').get(orderController.list)
orderRouter.route('/list').post(orderController.listById)
orderRouter.route('/status/update').post(orderController.update)
orderRouter.route('/status').post(orderController.status)

module.exports ={orderRouter}