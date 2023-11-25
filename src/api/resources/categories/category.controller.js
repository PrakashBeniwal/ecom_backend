const { error } = require('joi/lib/types/alternatives')
const db = require('../../../models')
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt-nodejs')
const {Op}=require("sequelize")
module.exports = {
     create(req, res, next) {
        const { name, slug } = req.body
        try {

            db.category.findOne({ where: { name } })
                .then((find) => {
                    if (find) {
                        return db.category.update({ name, slug },{where:{id:find.id}})
                    }
                    return db.category.create({ name, slug})

                })
                .then((cat) => {
                    if (cat) {
                        return res.status(200).json({ success: true, msg: "successfully inserted category",data:cat })
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


        getmainlist(req,res,next){

        db.category.findAll()
        .then(find=>{
            if (find) {
                return res.status(200).send({success:true,data:find})
            }
            throw new RequestError("cantfind category",400)
        }).catch(err=>{
            next(err)
            console.log(err)
        })
    },


    getMainlistUpdate(req,res,next){

        const{name,slug,id}=req.body;

        db.category.findOne({where:{id}})
        .then(find=>{
            if (find) {
              return  db.category.update({name,slug},{where:{id}})
            }
            throw new RequestError("category not found",400)
        }).then(data=>{
            return res.status(200).send({success:true,data})
        }).catch(err=>{
            next(err)
        })
    },
    deleteMainlist(req,res,next){


        db.category.findOne({where:{id:req.query.id}})
        .then(find=>{
            if (find) {
              return  db.category.destroy({where:{id:find.id}})
            }
            throw new RequestError("category not found",400)
        }).then(data=>{
            return res.status(200).send({success:true,data})
        }).catch(err=>{
            next(err)
        })
    },


    //subcategory

    addSubCategory(req,res,next){

        const{categoryId,sub_name}=req.body;

        db.SubCategory.findOne({where:{sub_name}})
        .then(find=>{
            if (find) {
              return  db.SubCategory.update({categoryId,sub_name},{where:{id:find.id}})
            }
            return db.SubCategory.create({categoryId,sub_name})
        }).then(data=>{
            return res.status(200).send({success:true})
        }).catch(err=>{
            next(err)
        })
    },


    getSubCategory(req,res,next){
        
        db.SubCategory.findAll(
            {
                include:{model:db.category, attributes: ["id", "name"] }
            }
        ).then(list=>{
            if (list) {
                return res.status(200).send({success:true,data:list})
            }
            throw new RequestError("cannot find subcategory",400)
        }).catch(err=>{
            next(err)
        })
    },


    getSubCategoryAdd(req,res,next){
        const {id,sub_name}=req.body;

        db.SubCategory.findOne({where:{id}}).then(find=>{
            if (find) {
                return db.SubCategory.update({sub_name},{where:{id:find.id}})
            }
            throw new RequestError("subcategory not found",500)
        }).then(list=>{
            return res.status(200).send({success:true})
        }).catch(err=>{
            next(err)
        })
    },

    getSubCategoryDelete(req,res,next){

        db.SubCategory.findOne({where:{id:req.query.id}}).then(find=>{
            if (find) {
                return db.SubCategory.destroy({where:{id:find.id}})
            }
            throw new RequestError("subcategory not found",500)
        }).then(list=>{
            return res.status(200).send({success:true})
        }).catch(err=>{
            next(err)
        })
    },

    getAllSubCategoryBySlug(req,res,next){

        db.SubCategory.findAll({where:{categoryId:req.query.categoryId}}).then(list=>{
            if (list) {
                return res.status(200).send({success:true,data:list})
            }
            throw new RequestError("cant find subcategory by categoryId",400)
        }).catch(err=>{
            next(err)
        })

    },

    /// childcategory

    getChildCategoryList(req,res,next){
        db.SubChildCategory.findAll({
            include: [{ model: db.SubCategory, attributes: ['id', 'sub_name'], include: [{ model: db.category, attributes: ["id", "name"] }] }]
            // include:[{model:db.SubCategory,attributes:["id","sub_name"],include:{model:db.Category,attributes:["id","name"]}}]
        })
        .then(list=>{
            if (list) {
                return res.status(200).send({success:true,data:list})
            }
            throw new RequestError("cannot get",400)
        }).catch(err=>{
            next(err)
        })
    },


    addSubChildCategory(req,res,next){

        const{categoryId,name,subcategoryId}=req.body;

        db.SubChildCategory.findOne({where:{name}}).then(find=>{
            if (find) {
                return db.SubChildCategory.update({categoryId,subcategoryId,name},{where:{id:find.id}})
            }
            return db.SubChildCategory.create({categoryId,name,subcategoryId})
        })
        .then(data=>{
            return res.status(200).json({success:true,data})
        }).catch(err=>{
            next(err)
        })
    },



    
    DeleteSubChildCategory(req,res,next){

        db.SubChildCategory.findOne({where:{id:req.query.id}}).then(find=>{
            if (find) {
                return db.SubChildCategory.destroy({where:{id:find.id}})
            }
            throw new RequestError("SubChildCategory not found",500)
        }).then(list=>{
            return res.status(200).send({success:true})
        }).catch(err=>{
            next(err);
        })
    },

    UpdateSubChildCategory(req,res,next){
        const {id,name}=req.body;

        db.SubChildCategory.findOne({where:{id}}).then(find=>{
            if (find) {
                return db.SubChildCategory.update({name},{where:{id:find.id}})
            }
            throw new RequestError("subChildCategory not found",500)
        }).then(list=>{
            return res.status(200).send({success:true})
        }).catch(err=>{
            next(err)
        })
    },



    getChildCategoryListByCategory(req,res,next){

        db.SubChildCategory.findAll({where:{subcategoryId:req.query.subcategoryId}}).then(find=>{
            if (find) {
                return res.status(200).send({success:true,data:find})
            }
            throw new RequestError("subchildcategory not found",500)
        }).catch(err=>{
            next(err)
        })
    },



    //getAllCategoryList

    getAllCategoryList(req,res,next){

        db.category.findOne({
            where:{slug:req.query.slug},
            include:[{model:db.SubCategory,include:{model:db.SubChildCategory}}]
        }).then(data=>{
            return res.status(200).json({success:true,data})
        }).catch(err=>{
            next(err)
        })
    },

/////filterByCategoryList

filterByCategoryList(req,res,next){
    db.product.findAll({
        where:{childCategoryId:req.params.id}
    }).then(data=>{
        return res.status(200).send({success:true,data})
    })
},

/// getCategoryBySearch


getCategoryBySearch(req,res,next){

    const{id,name}=req.body;

    var search="%%";

    if (name) {
        search="%"+name+"%";
    }

    db.SubCategory.findAll({
        attributes:["sub_name","id"],
        include:{model:db.product,order:["createdAt","DESC"],
    where:{
        [Op.or]:{
            name:{[Op.like]:search},
            subcategoryId:id
        }
    }
    }
    }).then(data=>{
        return res.status(200).json({
            data
        })
    })
}

}