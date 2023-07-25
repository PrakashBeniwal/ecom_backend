'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    fullname: DataTypes.STRING,
    phone: DataTypes.STRING,
    orderId: DataTypes.INTEGER,
    discrict: DataTypes.STRING,
    city: DataTypes.STRING,
    states: DataTypes.STRING,
    area: DataTypes.STRING,
    shipping: DataTypes.TEXT,
    custId: DataTypes.INTEGER
  }, {});
  Address.associate = function(models) {
    // associations can be defined here
    models.Address.belongsTo(models.order,{foriegnKey:"orderId"})
    models.Address.belongsTo(models.customer,{foriegnKey:"custId"})

  };
  return Address;
};