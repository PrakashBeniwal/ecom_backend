'use strict';
module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
    categoryId: DataTypes.INTEGER,
    subCategoryId: DataTypes.INTEGER,
    childCategoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    status: DataTypes.STRING,
    unitSize: DataTypes.STRING,
    buyerPrice: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    discountPer: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    netPrice: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    sortDesc: DataTypes.TEXT,
    slug: DataTypes.STRING,
    desc: DataTypes.TEXT
  }, {});
  product.associate = function(models) {
    // associations can be defined here
    models.product.belongsTo(models.category,{foreignKey:"categoryId"})
    models.product.hasMany(models.productphoto,{foreignKey:"productId"})

    models.product.belongsTo(models.SubCategory,{foreignKey:"subcategoryId"})

  };
  return product;
};