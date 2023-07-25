'use strict';
module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define('order', {
    custId: DataTypes.INTEGER,
    number: DataTypes.STRING,
    paymentmethod: DataTypes.STRING,
    grandtotal: DataTypes.INTEGER,
    status: DataTypes.ENUM('processing','shipping','delieverd','cancel'),
    deliverydate: DataTypes.DATE
  }, {});
  order.associate = function(models) {
    // associations can be defined 
    models.order.belongsTo(models.customer,{foriegnKey:"custId"})
    models.order.hasMany(models.Cart,{foriegnKey:"orderId"})
    models.order.hasMany(models.Address,{foriegnKey:"orderId"})
  };
  return order;
};