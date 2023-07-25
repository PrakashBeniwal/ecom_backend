const { error } = require('joi/lib/types/alternatives')
const db = require('../../../models')
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt-nodejs')
const { Op } = require("sequelize");
const AWS=require("aws-sdk")

const s3 = new AWS.S3({
    accessKeyId: 'AKIA2ZJXAJNPI4CK5KOK',
    secretAccessKey: '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',
})

var deleteFileFromS3 = (async (imgUrl) => {
    try {
        const lastItem = imgUrl.substring(imgUrl.lastIndexOf('/') + 1)
        var params = {
            Bucket: 'prakashbucketfirst',
            Key: lastItem,
        };
        s3.deleteObject(params, (error, data) => {
            if (error) {
                console.log(error, error.stack)
            }
            return data
        });
    } catch (error) {
        assert.isNotOk(error, 'Promise error');
        done();
    }
})


module.exports = {
     create(req, res, next) {
        const { categoryId,subCategoryId,
            childCategoryId,name,brand,
            status,unitSize,buyerPrice,price,
            qty,discountPer,discount,total,
            netPrice,
            sortDesc,slug,desc} = req.body
        try {


            if(!req.file){
                console.log("file not found")
                return res.status(400).json({ error: "please select file" })
            }

            db.product.findOne({ where: { name } })
                .then((find) => {
                    if (!find) {
                        return db.product.create({ categoryId,subCategoryId,childCategoryId,
                            name,brand,status,unitSize,buyerPrice,price,qty,discountPer,
                            discount,total,netPrice,photo: req.file ? req.file.location : '',sortDesc,slug,desc})
                    }
                    throw new RequestError("product is already exist",409)

                })
                .then((product) => {
                    if (product) {
                        return res.status(200).json({ success: true, msg: "successfully inserted product" })
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
        const {productId, categoryId,subCategoryId,childCategoryId,name,brand,status,unitSize,buyerPrice,price,qty,discountPer,discount,total,netPrice,photo,sortDesc,slug,desc} = req.body
        try {

            db.product.findOne({ where: { id:productId } })
                .then((find) => {
                    if (find) {
                        return db.product.update({ categoryId,subCategoryId,childCategoryId,name,brand,status,unitSize,buyerPrice,price,qty,discountPer,discount,total,netPrice,photo:req.file?.location,sortDesc,slug,desc},{where:{id:find.id}})
                    }
                    throw new RequestError("product is not exist",409)

                })
                .then((product) => {
                    if (product) {
                        return res.status(200).json({ success: true, msg: "successfully updated product" })
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

    getAllProductList(req,res,next){

        db.product.findAll({
            order:[["createdAt","DESC"]],
            include:[{ model: db.SubCategory, attributes: ["id", "sub_name"], include: [{ model: db.category, attributes: ["id", "name"] }] }]
        })
        .then(find=>{
            if (find) {
                return res.status(200).send({success:true,product:find})
            }
            throw new RequestError("cantfind product",400)
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
        })
    },

    delete(req,res,next){

        db.product.findOne({where:{id:req.query.id}}).then(find=>{
            if (find) {
                return db.product.destroy({where:{id:find.id}})
            }
            throw new RequestError("product not found",500)
        }).then(list=>{
            return res.status(200).send({success:true})
        })
    },

    getAllSubCategoryBySlug(req,res,next){

        db.SubCategory.findAll({where:{categoryId:req.query.categoryId}}).then(list=>{
            if (list) {
                return res.status(200).send({success:true,data:list})
            }
            throw new RequestError("cant find subcategory by slug",400)
        }).catch(err=>{
            next(err)
        })

    },

    /// childcategory

    getChildCategoryList(req,res,next){
        db.SubChildCategory.findAll({
            include: [{ model: db.SubCategory, attributes: ['id', 'sub_name'], include: [{ model: db.category, attributes: ["id", "name"] }] }]
            // include:[{model:db.SubCategory,attributes:["id","sub_name"],include:{model:db.Category,attributes:["id","name"]}}]
        }).then(list=>{
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
        })
    },



/// getAllGroceryStaple

getAllGroceryStaple(req,res,next){

    db.category.findOne({
        include:[{model:db.product,order:["createdAt","DESC"]}],
        attributes:["slug","id"],
        where:{slug:"grocery-staples"}
    }).then(data=>{
        return res.status(200).send({success:true,data})
    }).catch(err=>{
        next(err)
    })


},

// getProductById

getProductById(req,res,next){

    db.product.findOne({
        where:{id:req.query.id},
        include:{model:db.productphoto}
    }).then(data=>{
        return res.status(200).json({success:true,data:data})
    }).catch(err=>{
        next(err)
    })
}



,
//getProductBySlug


getProductBySlug(req,res,next){

    db.category.findOne({
        include:[{model:db.product,order:["createdAt","DESC"]}],
        attributes:["slug","id"],
        where:{slug:req.params.slug}
    }).then(data=>{
        return res.status(200).send({success:true,data})
    }).catch(err=>{
        next(err)
    })
},

getProductBySearch(req,res,next){

    var search="%%";

    if (req.query.search) {
        search=`%${req.query.search}%`
    }

    db.SubCategory.findAll(

        {

            include:{model:db.product,order:["createdAt","DESC"],required:true
            ,where:{
                [Op.or]:[{
                    name:{[Op.like]:search},
                  

                },
            {  slug:{[Op.like]:search}}
            ]
            }
        }

        }
    ).then(find=>{
        return res.status(200).send({success:true,data:find})
    })

},

async getAllPhoto(req, res, next) {
    try {
        db.product.findAll({
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'brand'],
            include: [{ model: db.productphoto, attributes: ['id', 'imgUrl'] }]
        })
            .then(data => {
                res.status(200).json({ 'success': true, data });
            })
            .catch(function (err) {
                next(err)
            });
    }
    catch (err) {
        throw new RequestError('Error');
    }
},

async multiplePhotoUpload(req, res, next) {
    let attachmentEntries = [];
    var productId = req.body.productId;
    for (var i = 0; i < req.files.length; i++) {
        attachmentEntries.push({
            productId: productId,
            name: req.files[i].filename,
            mime: req.files[i].mimetype,
            imgUrl: req.files[i].location,
        })
    }

    db.product.findOne({
        where: { id: productId },
    }).then(r => {
        if (r) {
            return db.productphoto.bulkCreate(attachmentEntries)
            // queue.create('img-upload', {
            //     productId: productId,
            //     productName: r.item_name,
            //     attachmentEntries: attachmentEntries,
            // }).save();
        }
        throw new RequestError('ProductId is not found')
    }).then(r => {
        res.status(200).json({ success: r });
    })
        .catch(function (error) {
            console.log(error);
            res.status(500).json({ 'errors': ['Error insert photo'] });
        });
},

async awsProductPhotoDelete(req, res, next) {
    try {
        const { id, imgUrl } = req.body;
        deleteFileFromS3(imgUrl)
            .then((data) => {
                if (!data) {
                    return db.productphoto.destroy({ where: { id: id } })
                }
                throw new RequestError('error');
            })
            .then((success) => {
                res.status(200).json({ 'success': true, msg: "Successflly deleted image from s3 Bucket" });
            })

    }
    catch (err) {
        next(err)
        // res.status(500).json({ 'success':false, msg: err})
    }
},


}