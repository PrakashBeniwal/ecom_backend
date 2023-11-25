const express=require('express')
const categoryController=require('./category.controller.js');
const { jwtstrategy } = require('../../../middleware/strategy.js');

const categoryRouter=express.Router();

// Category routes
categoryRouter.route('/create').post(jwtstrategy,categoryController.create)
categoryRouter.route('/main-list').get(categoryController.getmainlist)
categoryRouter.route('/main-list/update').post(jwtstrategy,categoryController.getMainlistUpdate)
categoryRouter.route('/main-list/delete').delete(jwtstrategy,categoryController.deleteMainlist)


// Subcategory routes

categoryRouter.route('/create-sub').post(jwtstrategy,categoryController.addSubCategory)
categoryRouter.route('/sub-list').get(categoryController.getSubCategory)
categoryRouter.route('/sub-list/update').post(jwtstrategy,categoryController.getSubCategoryAdd)
categoryRouter.route('/sub-list/delete').delete(jwtstrategy,categoryController.getSubCategoryDelete)
categoryRouter.route('/getAllSubCategory').get(categoryController.getAllSubCategoryBySlug)


//childcategory routes

categoryRouter.route('/create-sub-child').post(jwtstrategy,categoryController.addSubChildCategory)
categoryRouter.route('/list').get(categoryController.getChildCategoryList)
categoryRouter.route('/child/deleteById').delete(jwtstrategy,categoryController.DeleteSubChildCategory)
categoryRouter.route('/child/updateById').post(jwtstrategy,categoryController.UpdateSubChildCategory)
categoryRouter.route('/getAllSubChildCategory').get(categoryController.getChildCategoryListByCategory)


categoryRouter.route('/cn/list').get(categoryController.getAllCategoryList)
categoryRouter.route('/c/:slug/:id').get(categoryController.filterByCategoryList)



categoryRouter.route('/catlogsearch/product').post(categoryController.getCategoryBySearch)

/// /catlogsearch/child-category 
//mobile/getAllCategory
// mobile/getAllSubCategoryById

module.exports ={categoryRouter}