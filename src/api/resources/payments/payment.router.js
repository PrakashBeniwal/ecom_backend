const express=require('express')
const paymentController=require('./payment.controller.js')
const jwtstrategy=require("../../../middleware/jwtstrategy.js")

const paymentRouter=express.Router();
paymentRouter.route('/orders').post( paymentController.orderDetails);
paymentRouter.route('/orderlist').post( paymentController.findOrderList);
paymentRouter.route('/getAllPayment').get(paymentController.getAllPayment);

// paymentRouter.route('/verification').post(paymentController.paymentVerification);
// paymentRouter.route('/verification').post(sanitize(),paymentController.paymentSuccess);



module.exports ={paymentRouter}