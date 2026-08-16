'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserOrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserOrderItems.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    variant: DataTypes.STRING,
    price: DataTypes.INTEGER(10, 2)
  }, {
    sequelize,
    modelName: 'UserOrderItems',
    tableName: 'user_order_items',
    underscored: true,
    updatedAt: false,
  });
  return UserOrderItems;
};