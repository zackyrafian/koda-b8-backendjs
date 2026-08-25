'use strict';
const {
  Model
} = require('sequelize');
const argon2 = require('argon2');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.UserProfile, { 
        foreignKey: 'user_id', 
        as: 'profile'
      })
      User.hasMany(models.ProductReviews, { 
        foreignKey: 'user_id', 
        as: 'reviews'
      })
      User.belongsToMany(models.Products, { 
        through: models.UserCart, 
        as: 'cart_products', 
        foreignKey: 'user_id',
        otherKey: 'product_id'
      })
      User.hasMany(models.UserOrders, { 
        foreignKey: 'user_id', 
        as: 'orders'
      })
      User.hasMany(models.UserAddress, { 
        foreignKey: 'user_id', 
        as: 'addresses'
      })
    }
  }
  User.init({
    email: { 
      type: DataTypes.STRING,
      unique: true, 
      validate: { 
        isEmail: { 
          msg: "Invalid email format."
        }
      }
    },
    password: { 
      type: DataTypes.STRING, 
      validate: { 
        len: { 
          args: [8, 100],
          msg: "Password must be at least 8 characters long."
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    hooks: { 
      beforeSave: async (user) => { 
        if (user.changed("password")) { 
          user.password = await argon2.hash(user.password)
        }
      }
    }
  });
  return User;
};