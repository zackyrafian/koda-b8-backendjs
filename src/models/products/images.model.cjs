'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductImages.belongsTo(models.Products, { 
        foreignKey: 'product_id', 
        as: 'products'
      })
    }
  }
  ProductImages.init({
    product_id: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductImages',
    tableName: 'product_images',
    underscored: true,
  });
  return ProductImages;
};