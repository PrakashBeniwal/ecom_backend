'use strict';
module.exports = (sequelize, DataTypes) => {
  const area = sequelize.define('area', {
    name: DataTypes.STRING,
    status: DataTypes.ENUM('active','inactive'),
    zipcode: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER
  }, {});
  area.associate = function(models) {
    // associations can be defined here
    models.area.belongsTo(models.location,{foreignKey:"locationId"})

  };
  return area;
};