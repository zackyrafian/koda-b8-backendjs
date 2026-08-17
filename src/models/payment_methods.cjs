'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentMethods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  PaymentMethods.init({
    code: DataTypes.STRING,
    va_code: DataTypes.STRING,
    va_length: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    logo_url: DataTypes.STRING,
    admin_fee: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PaymentMethods',
    tableName: 'payment_methods',
    underscored: true, 
    updatedAt: false,
  });
  return PaymentMethods;
};