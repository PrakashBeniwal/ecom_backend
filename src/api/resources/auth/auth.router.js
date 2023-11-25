const express=require('express')
const authController=require('./auth.controller.js')
const { LocalStrategy, jwtstrategy } = require('../../../middleware/strategy.js');
const { sanitize } = require('../../../middleware/sanitizer.js');

const authRouter=express.Router();

authRouter.route('/register').post(authController.adduser)
authRouter.route('/rootLogin').post(sanitize(),LocalStrategy,authController.login)
authRouter.route('/user').post(jwtstrategy,authController.finduser)


module.exports ={authRouter}