'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubChildCategory = sequelize.define('SubChildCategory', {
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    subcategoryId: DataTypes.INTEGER
  }, {});
  SubChildCategory.associate = function(models) {
    // associations can be defined here
    models.SubChildCategory.belongsTo(models.category,{foreignKey:"categoryId"})
    models.SubChildCategory.belongsTo(models.SubCategory,{foreignKey:"subcategoryId"})

  };
  return SubChildCategory;
};