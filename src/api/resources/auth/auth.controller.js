const { error } = require('joi/lib/types/alternatives')
const db = require('./../../../models')
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt-nodejs')

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
        const { firstName, lastName, email, address, phone, password, role, verify } = req.body
        try {

            const hashpassword=bcrypt.hashSync(password);
            db.User.findOne({ where: { email } })
                .then((user) => {
                    if (user) {
                        throw new RequestError('Email is already in use', 409);
                    }
                    return db.User.create({ firstName, lastName, email, address, phone, password:hashpassword, role, verify })

                })
                .then((user) => {
                    if (user) {
                        return res.status(200).json({ success: true, msg: "new user is created" })
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



    login(req,res,next){

        const {email,password,role}=req.body;
        const date=new Date();
        db.User.findOne({where:{email}})
        .then(user=>{
            if (user) {

                const verify=bcrypt.compareSync(password,user.password);

                if (verify) {
                    const token= JWTSIGN(user,date)
                    res.cookie('XSRF-token',     token, {
                        expire: new Date().setMinutes(date.getMinutes() + 30),
                        httpOnly: true, secure: process.env.APP_SECURE
                    });
                    return res.json({ success: true ,token,role:user.role})      
                }

                throw new RequestError('email or password is invalid',400)
            }

            return res.status(400).json({error:"email is not exist"})
        })
        .catch(err=>{
            next(err)
        })
    },

    finduser(req,res,next){

        db.User.findOne({where:{id:req.user.sub}})
        .then(user=>{
            return res.send({user})
        }).catch(err=>{
            next(err)
        })

    }



}