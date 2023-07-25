const { error } = require('joi/lib/types/alternatives')
const db = require('../../../models')
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt-nodejs')
const { DOUBLE } = require('sequelize')

const JWTSIGN=(user,date)=>{
   return jwt.sign({
        sub: user.id,
        iam : user.type,
        iat: date.getTime(),
        exp: new Date().setMinutes(date.getMinutes() + 30)
   },process.env.APP_SECRET
   )
    
}

module.exports = {
     index(req, res, next) {
        const { customerId, paymentmethod, orderId, deliveryAddress, product, grandTotal } = req.body
        try {

            db.customer.findOne({ where: { id:customerId } })
                .then((user) => {
                    if (user) {
                        return db.order.create({ custId:customerId, number:orderId, paymentmethod, grandtotal:grandTotal })
                    }
                    throw new RequestError('customer is not exist', 409);

                })
                .then((order) => {
                    if (order) {
                      return db.Address.create({
                            orderId:order.id,
                            custId:customerId,
                            fullname: deliveryAddress?deliveryAddress.name:'',
                            phone: deliveryAddress?deliveryAddress.phone:'',
                            discrict: deliveryAddress?deliveryAddress.discrict:'',
                            city: deliveryAddress?deliveryAddress.city:'',
                            states: deliveryAddress?deliveryAddress.states:'',
                            shipping: deliveryAddress?deliveryAddress.address:'',
                        }).then((p)=>[order,p])
                    }
                })
                .then(([order,p])=>{

                    if (order) {
                        let cartEntries=[]

                        for (let i = 0; i < product.length; i++) {

                            cartEntries.push({
                             productId:product[i].id,
                            name:product[i].name,
                            orderId:order.id,
                            addressId:p.id,
                            price:product[i].price,
                            total:product[i].total,
                            qty:product[i].qty,
                            photo:product[i].photo,
                            })
                        }
                      return  db.Cart.bulkCreate(cartEntries)
                    }
                }).then(success=>{
                    return res.status(200).json({success:true})
                })
                .catch((err) => {
                    next(err);
                })

        } catch (error) {
            console.log({ error })
            return res.status(400).send({ msg: "internal server error" })
        }
    },



    count(req,res,next){

        db.order.findAll({
            attributes:['status',[db.sequelize.fn("COUNT",db.sequelize.col("status")),"total"]],
            group:"status"
        })
        .then(order=>{
            // console.log({order})
            return res.status(200).send({data:order,success:true})
        }).catch(err=>{
            next(err)
        })
    },

    list(req,res,next){

        db.order.findAll({
            include:[{model:db.Address,attributes:["fullname","phone","orderId","discrict","city","states",
        "shipping","area","custId"]},{model:db.Cart}],
        order:[["createdAt","DESC"]]
        })
        .then(order=>{
            return res.status(200).send({order:order,success:true})
        }).catch(err=>{
            next(err)
        })
    },
    listById(req,res,next){

        db.order.findAll({
            where:{custId:req.body.id},
            include:[{model:db.Address,attributes:["fullname","phone","orderId","discrict","city","states",
            "shipping","area","custId"]},{model:db.Cart}],
            order:[["createdAt","desc"]]
        })
        .then(order=>{
            return res.status(200).send({order:order,success:true})
        }).catch(err=>{
            next(err)
        })
    },


    update(req,res,next){
        const{id,deliverydate,status}=req.body;

        db.order.findOne({where:{id}}).then(order=>{
            if (order) {
              return  db.order.update({deliverydate:deliverydate?deliverydate:order.deliverydate,status:status?status:order.status},{where:{id}})
            }
        }).then(success=>{
            if (success) {
                return res.status(200).send({success:true,msg:"order updated successfully"})
            }
            throw new RequestError("error in updating order",400)
        }).catch(err=>{
            next(err)
        })
    }
,
    status(req,res,next){

        db.order.findAll({
            where:{status:req.body.status},
            order: [['createdAt', 'DESC']],
            include:[{model:db.Address,attributes:{exclude: ['customerId']}},{model:db.Cart}]
        })
        .then(order=>{
            return res.status(200).send({order:order,success:true})
        }).catch(err=>{
            next(err)
        })
    }

}