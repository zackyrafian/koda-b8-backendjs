'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductVariants.belongsTo(models.Products, { 
        foreignKey: 'product_id', 
        as: 'products'
      })
    }
  }
  ProductVariants.init({
    name: DataTypes.STRING,
    product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductVariants',
    tableName: 'product_variants',
    underscored: true, 
    updatedAt: false,
  });
  return ProductVariants;
};