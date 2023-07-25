'use strict';
module.exports = (sequelize, DataTypes) => {
  const vendor_areas = sequelize.define('vendor_areas', {
    vendorId: DataTypes.INTEGER,
    areaId: DataTypes.INTEGER
  }, {});
  vendor_areas.associate = function(models) {
    // associations can be defined here
  };
  return vendor_areas;
};