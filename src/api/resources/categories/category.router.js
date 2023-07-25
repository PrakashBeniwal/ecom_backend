const express=require('express')
const categoryController=require('./category.controller.js')
const jwtstrategy=require("../../../middleware/jwtstrategy.js")

const categoryRouter=express.Router();

// Category routes
categoryRouter.route('/create').post(categoryController.create)
categoryRouter.route('/main-list').get(categoryController.getmainlist)
categoryRouter.route('/main-list/update').post(categoryController.getMainlistUpdate)
categoryRouter.route('/main-list/delete').delete(categoryController.deleteMainlist)


// Subcategory routes

categoryRouter.route('/create-sub').post(categoryController.addSubCategory)
categoryRouter.route('/sub-list').get(categoryController.getSubCategory)
categoryRouter.route('/sub-list/update').post(categoryController.getSubCategoryAdd)
categoryRouter.route('/sub-list/delete').delete(categoryController.getSubCategoryDelete)
categoryRouter.route('/getAllSubCategory').get(categoryController.getAllSubCategoryBySlug)


//childcategory routes

categoryRouter.route('/create-sub-child').post(categoryController.addSubChildCategory)
categoryRouter.route('/list').get(categoryController.getChildCategoryList)
categoryRouter.route('/child/deleteById').delete(categoryController.DeleteSubChildCategory)
categoryRouter.route('/child/updateById').post(categoryController.UpdateSubChildCategory)
categoryRouter.route('/getAllSubChildCategory').get(categoryController.getChildCategoryListByCategory)


categoryRouter.route('/cn/list').get(categoryController.getAllCategoryList)
categoryRouter.route('/c/:slug/:id').get(categoryController.filterByCategoryList)



categoryRouter.route('/catlogsearch/product').post(categoryController.getCategoryBySearch)

/// /catlogsearch/child-category 
//mobile/getAllCategory
// mobile/getAllSubCategoryById

module.exports ={categoryRouter}