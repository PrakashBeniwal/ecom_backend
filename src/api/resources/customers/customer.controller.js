const { error } = require('joi/lib/types/alternatives')
const db = require('../../../models')
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt-nodejs')
const mailer = require('../../../mailer')

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
     adduser(req, res, next) {
        const { firstName, lastName, email, phone, password, userid, gender } = req.body
        try {

            const hashpassword=bcrypt.hashSync(password);
            db.customer.findOne({ where: { email } })
                .then((user) => {
                    if (user) {
                        throw new RequestError('Email is already in use', 409);
                    }
                    return db.customer.create({ firstName, lastName, email, userid, phone, password:hashpassword, gender })

                })
                .then(async(user) => {
                    if (user) {
                       await mailer.sendEmail(email);
                        return res.status(200).json({ success: true, msg: "new user is created" })
                    }
                    else {
                        res.status(500).json({ success: false })
                    }
                })
                .catch((err) => {
                    res.status(409).send({errors:['email is already in use please login']})
                    next(err);
                })

        } catch (error) {
            console.log({ error })
            return res.status(400).send({ msg: "internal server error" })
        }
    },



    async login(req, res, next) {
        var date = new Date();
        var token = JWTSIGN(req.user, date);
        res.cookie('XSRF-token',     token, {
            expire: new Date().setMinutes(date.getMinutes() + 30),
            httpOnly: true, secure: process.env.APP_SECURE
        });
        
        return res.status(200).json({ success: true ,token});
    },

    finduserByEmail(req,res,next){

        db.customer.findOne({where:{email:req.query.email},include:[{model:db.Address,attributes:['shipping' , 'area' , 'city' , 'discrict' , 'states']}]})
        .then(user=>{
            return res.status(200).send({data:user,success:true})
        }).catch(err=>{
            next(err)
        })

    },

    //update

    update(req, res, next) {
        const { firstName, lastName, phone, gender,id} = req.body.data
        try {

            db.customer.findOne({ where: { id } })
                .then((user) => {
                    if (user) {
                       return db.customer.update({ firstName, lastName,  phone,  gender },{where:{id:user.id}})
                     
                    }
                    throw new RequestError('Email is not exist', 400);

                })
                .then((user) => {
                    if (user) {
                        return res.status(200).json({ success: true, msg: " user is updated" })
                    }
                    else {
                        res.status(500).json({ success: false })
                    }
                })
                .catch((err) => {
                    next(err);
                })

        } catch (error) {
            console.log({ error })
            return res.status(400).send({ msg: "internal server error" })
        }
    },

    async list(req,res,next){

        db.customer.findAll().then(find=>{
            return res.status(200).send({success:true,data:find})
        }).catch(err=>{
            console.log(err)
            next(err)
        })
    },



    delete(req,res,next){

        db.customer.findOne({where:{id:req.query.id}}).then(find=>{

            if (find) {
                return db.customer.destroy({where:{id:find.id}})
            }
            throw new RequestError("customer not found",409)
        }).catch(err=>{
            next(err)
        })
    }

}