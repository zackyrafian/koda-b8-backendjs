'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserCart.belongsTo(models.Products, { 
        foreignKey: 'product_id', 
        as: 'products'
      })
    }
  }
  UserCart.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: { 
      type: DataTypes.INTEGER, 
      validate: { min: 1 }
    },
    variant: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserCart',
    tableName: 'user_carts', 
    underscored: true
  });
  return UserCart;
};