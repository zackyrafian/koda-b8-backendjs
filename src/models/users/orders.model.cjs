'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserOrders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserOrders.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' })
      UserOrders.belongsTo(models.UserAddress, { as: 'address', foreignKey: 'address_id'})
      UserOrders.hasMany(models.UserOrderItems, { as: 'items', foreignKey: 'order_id'})
      UserOrders.hasOne(models.Payments, { as: 'payment', foreignKey: 'order_id'})
    }
  }
  UserOrders.init({
    user_id: DataTypes.INTEGER,
    address_id: DataTypes.INTEGER,
    total_price: DataTypes.DECIMAL(10, 2),
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserOrders',
    tableName: 'user_orders', 
    underscored: true,
  });
  return UserOrders;
};