'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Products.hasMany(models.UserCart, { 
        foreignKey: 'product_id', 
        as: 'carts'
      })
      Products.belongsTo(models.ProductBrands, { 
        foreignKey: 'brand_id', 
        as: 'brand', 
      })
      Products.belongsTo(models.ProductCategories, { 
        foreignKey: 'category_id', 
        as: 'category'
      })
      Products.hasMany(models.ProductImages, { 
        foreignKey: 'product_id', 
        as: 'images'
      })
      Products.hasMany(models.ProductVariants, { 
        foreignKey: 'product_id', 
        as: 'variants'
      })
    }
  }
  Products.init({
    name: DataTypes.STRING,
    brand_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    sold_out: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Products',
    tableName: 'products', 
    underscored: true,
  });
  return Products;
};