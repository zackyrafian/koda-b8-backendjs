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
      Products.hasMany(models.ProductReviews, { 
        foreignKey: 'product_id', 
        as: 'reviews'
      })
    }
  }
  Products.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(15, 2),
    discount: DataTypes.INTEGER,
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    sold_out: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Products',
    tableName: 'products', 
    underscored: true,
    paranoid: true
  });
  return Products;
};