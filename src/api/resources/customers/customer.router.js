const express=require('express')
const customerController=require('./customer.controller')
const jwtstrategy=require("../../../middleware/jwtstrategy.js")

const customerRouter=express.Router();

customerRouter.route('/register').post(customerController.adduser)
customerRouter.route('/login').post(customerController.login)
customerRouter.route('/getUserByEmailId').get(customerController.finduserByEmail)
customerRouter.route('/update').post(customerController.update)
customerRouter.route('/list').post(customerController.list)
customerRouter.route('/delete').delete(customerController.delete)

module.exports ={customerRouter}