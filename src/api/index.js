const express=require('express')
const authRouter=require('./resources/auth')
const categoryRouter=require('./resources/categories')
const productRouter=require('./resources/products');
const locationRouter  = require('./resources/location');
const payments = require('./resources/payments');
const order = require('./resources/order');
const customers = require('./resources/customers');
const vendor = require('./resources/vendor');

const resRouter=express.Router();

resRouter.use('/auth',authRouter);
resRouter.use('/category',categoryRouter);
resRouter.use('/product',productRouter);
resRouter.use('/location',locationRouter);
resRouter.use('/payment',payments);
resRouter.use('/order',order);
resRouter.use('/customer',customers);
resRouter.use('/vendor',vendor);

module.exports={resRouter}