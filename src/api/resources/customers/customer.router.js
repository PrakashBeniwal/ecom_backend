const express=require('express')
const customerController=require('./customer.controller')
const jwtstrategy=require("../../../middleware/jwtstrategy_x.js");
const { validateBody,  schema } = require('../../../middleware/validation');
const {sanitize} = require('../../../middleware/sanitizer');
const passport = require('passport');
const { customerStrategy, customerjwt } = require('../../../middleware/strategy');

const customerRouter=express.Router();

customerRouter.route('/register').post(validateBody(schema.customerResister), customerController.adduser)
customerRouter.route('/login').post(sanitize(),validateBody(schema.loginSchema),customerStrategy,customerController.login)
customerRouter.route('/getUserByEmailId').get(customerjwt,customerController.finduserByEmail)
customerRouter.route('/update').post(customerjwt,customerController.update)
customerRouter.route('/list').post(jwtstrategy,customerController.list)
customerRouter.route('/delete').delete(jwtstrategy,customerController.delete)

module.exports ={customerRouter}