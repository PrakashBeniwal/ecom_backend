'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define('SubCategory', {
    categoryId: DataTypes.INTEGER,
    sub_name: DataTypes.STRING
  }, {});
  SubCategory.associate = function(models) {
    // associations can be defined here
    models.SubCategory.belongsTo(models.category,{foreignKey:"categoryId"})
    models.SubCategory.hasMany(models.SubChildCategory,{foreignKey:"subcategoryId"})
    models.SubCategory.hasMany(models.product,{foreignKey:"subcategoryId"})

  };
  return SubCategory;
};