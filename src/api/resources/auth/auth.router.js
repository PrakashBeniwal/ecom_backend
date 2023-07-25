const express=require('express')
const authController=require('./auth.controller.js')
const jwtstrategy=require("./../../../middleware/jwtstrategy.js")

const authRouter=express.Router();

authRouter.route('/register').post(authController.adduser)
authRouter.route('/rootLogin').post(authController.login)
authRouter.route('/user').post(jwtstrategy,authController.finduser)


module.exports ={authRouter}