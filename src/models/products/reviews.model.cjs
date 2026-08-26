'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductReviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductReviews.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      })
      ProductReviews.belongsTo(models.Products, {
        foreignKey: 'product_id',
        as: 'product'
      })
      ProductReviews.belongsTo(models.ProductVariants, {
        foreignKey: 'variant_id',
        as: 'variant'
      })
    }
  }
  ProductReviews.init({
    product_id: DataTypes.INTEGER,
    variant_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rating: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductReviews',
    tableName: 'product_reviews',
    underscored: true, 
  });
  return ProductReviews;
};