'use strict';
module.exports = (sequelize, DataTypes) => {
  const payment = sequelize.define('payment', {
    orderCreationId: DataTypes.STRING,
    razorpayPaymentId: DataTypes.STRING,
    custId: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE,
    status: DataTypes.STRING,
    razorpayOrderId: DataTypes.STRING,
    method: DataTypes.STRING,
    currency: DataTypes.STRING
  }, {});
  payment.associate = function(models) {
    // associations can be defined here
    models.payment.belongsTo(models.customer,{foreignKey:"custId"})

  };
  return payment;
};