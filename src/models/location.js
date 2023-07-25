'use strict';
module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    name: DataTypes.STRING,
    status: DataTypes.ENUM('active','inactive')
  }, {});
  location.associate = function(models) {
    // associations can be defined here
    models.location.hasMany(models.area,{foreignKey:"locationId"})
  };
  return location;
};