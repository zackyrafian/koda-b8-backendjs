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
      User.belongsTo(models.Roles, {
        foreignKey: 'role_id',
        as: 'role_ref'
      })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email format."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: "Password must be at least 8 characters long."
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'USER',
      validate: {
        isIn: [['ADMIN', 'USER']],
      },
    },
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    hooks: {
      beforeValidate: async (user) => {
        if (user.email) user.email = user.email.toLowerCase()
      },
      beforeCreate: async (user) => {
        const roleName = user.role || 'USER'
        const [role] = await user.sequelize.models.Roles.findOrCreate({
          where: { name: roleName }
        })
        user.role_id = role.id
      },
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.password = await argon2.hash(user.password)
        }
      }
    }
  });
  return User;
};