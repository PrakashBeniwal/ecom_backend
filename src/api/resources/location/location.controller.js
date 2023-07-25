const { error } = require('joi/lib/types/alternatives')
const db = require('../../../models')
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt-nodejs')

module.exports = {
     create(req, res, next) {
        const { name,status} = req.body
        try {

            db.location.findOne({ where: { name } })
                .then((find) => {
                    if (!find) {
                        return db.location.create({status:parseInt(status)?"active":"inactive",name})
                    }
                    return db.location.update({status:parseInt(status)?"active":"inactive",name},{where:{id:find.id}})

                })
                .then((location) => {
                    if (location) {
                        return res.status(200).json({ success: true, msg: "successfully inserted location" })
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




    update(req, res, next) {
        const {name,status,id} = req.body
        try {

            db.location.findOne({ where: { id:id } })
                .then((find) => {
                    if (find) {
                        return db.location.update({name,status:parseInt(status)?"active":"inactive"},{where:{id:find.id}})
                    }
                    throw new RequestError("location is not exist",409)

                })
                .then((location) => {
                    if (location) {
                        return res.status(200).json({ success: true, msg: "successfully updated location" })
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





    getLocationList(req,res,next){

        db.location.findAll({
            order:[["createdAt","DESC"]],
        })
        .then(find=>{
            if (find) {
                return res.status(200).send({success:true,data:find})
            }
            throw new RequestError("cantfind location",400)
        }).catch(err=>{
            next(err)
            console.log(err)
        })
    },



    
    delete(req,res,next){

        db.location.findOne({where:{id:req.query.id}}).then(find=>{
            if (find) {
                return db.location.destroy({where:{id:find.id}})
            }
            throw new RequestError("location not found",500)
        }).then(list=>{
            return res.status(200).send({success:true})
        }).catch(err=>{
            next(err)
        })
    },




    // Area 


    createArea(req, res, next) {
        const { name,status,zipcode,locationId} = req.body
        try {

            db.area.findOne({ where: { name } })
                .then((find) => {
                    if (!find) {
                        return db.area.create({status:parseInt(status)?"active":"inactive",name,zipcode,locationId})
                    }

                 return db.area.update({status:parseInt(status)?"active":"inactive",name,zipcode,locationId},{where:{id:find.id}})


                })
                .then((area) => {
                    if (area) {
                        return res.status(200).json({ success: true, msg: "successfully inserted location" })
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



    getAreaList(req,res,next){

        db.area.findAll({
            // order:[["createdAt","DESC"]],
            include:[{model:db.location,attributes:["name","id"]}]
        })
        .then(find=>{
            if (find) {
                return res.status(200).send({success:true,data:find})
            }
            throw new RequestError("cantfind location",400)
        }).catch(err=>{
            next(err)
            console.log(err)
        })
    },



    updateArea(req, res, next) {
        const {name,status,id,locationId,} = req.body
        try {

            db.area.findOne({ where: { id:id } })
                .then((find) => {
                    if (find) {
                        return db.area.update({name,status:parseInt(status)?"active":"inactive",locationId},{where:{id:find.id}})
                    }
                    throw new RequestError("area is not exist",409)

                })
                .then((area) => {
                    if (area) {
                        return res.status(200).json({ success: true, msg: "successfully updated area" })
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



    deleteArea(req,res,next){

        db.area.findOne({where:{id:req.query.id}}).then(find=>{
            if (find) {
                return db.area.destroy({where:{id:find.id}})
            }
            throw new RequestError("area not found",500)
        }).then(list=>{
            return res.status(200).send({success:true})
        }).catch(err=>{
            next(err)
        })
    },



    
    async getAreaListById(req, res, next) {
        try {
            db.area.findAll({
                where: { locationId: req.query.id },
                include: [{ model: db.location, attributes: ["id", "name"] }]
            })
                .then(list => {
                    res.status(200).json({ 'success': true, data: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },
    
}


