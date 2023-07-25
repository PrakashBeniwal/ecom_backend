'use strict';
module.exports = (sequelize, DataTypes) => {
  const vendor_products = sequelize.define('vendor_products', {
    supplierId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    unitSize: DataTypes.STRING
  }, {});
  vendor_products.associate = function(models) {
    // associations can be defined here
  };
  return vendor_products;
};