'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductBrands extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductBrands.hasMany(models.Products, { 
        foreignKey: 'brand_id',
        as: 'products'
      })
    }
  }
  ProductBrands.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductBrands',
    tableName: 'brands', 
    underscored: true,
  });
  return ProductBrands;
};