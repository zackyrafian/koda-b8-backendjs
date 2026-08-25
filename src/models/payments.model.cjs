'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payments.belongsTo(models.PaymentMethods, {
        foreignKey: 'payment_method_id',
        as: 'method'
      })
    }
  }
  Payments.init({
    order_id: DataTypes.INTEGER,
    payment_method_id: DataTypes.INTEGER,
    va_number: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    admin_fee: DataTypes.DECIMAL,
    total_amount: DataTypes.DECIMAL,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING',
      validate: {
        isIn: [['PENDING', 'PAID', 'EXPIRED']],
      },
    },
    expired_at: DataTypes.DATE,
    paid_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payments',
    tableName: 'payments',
    underscored: true,
  });
  return Payments;
};