'use strict';
module.exports = (sequelize, DataTypes) => {
  const vendor = sequelize.define('vendor', {
    storename: DataTypes.STRING,
    status: DataTypes.ENUM('active','inactive'),
    shopaddress: DataTypes.TEXT,
    ownername: DataTypes.STRING,
    owneraddress: DataTypes.TEXT,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.TEXT,
    areaId: DataTypes.INTEGER,
    accountNo: DataTypes.STRING,
    accountHolderName: DataTypes.STRING,
    IFSC: DataTypes.STRING,
    bankName: DataTypes.STRING,
    branch: DataTypes.STRING,
    adharCardNo: DataTypes.STRING,
    panCardNo: DataTypes.STRING,
    GSTNo: DataTypes.STRING
  }, {});
  vendor.associate = function(models) {
    // associations can be defined here

    models.vendor.belongsTo(models.area,{foreignKey:"areaId"})
  };
  return vendor;
};