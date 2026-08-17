'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserWishlists extends Model {
    static associate(models) {
      UserWishlists.belongsTo(models.Products, {
        foreignKey: 'product_id',
        as: 'product'
      })
    }
  }
  UserWishlists.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserWishlists',
    tableName: 'user_wishlists',
    underscored: true,
    updatedAt: false,
  });
  return UserWishlists;
};