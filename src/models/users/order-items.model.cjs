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
      UserOrderItems.belongsTo(models.Products, { as: 'product', foreignKey: 'product_id' })
    }
  }
  UserOrderItems.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: { 
      type: DataTypes.INTEGER, 
      validate: { min: 1 }
    },
    variant: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'UserOrderItems',
    tableName: 'user_order_items',
    underscored: true,
  });
  return UserOrderItems;
};