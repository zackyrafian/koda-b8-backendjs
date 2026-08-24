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
      User.hasOne(models.ProductReviews, { 
        foreignKey: 'user_id', 
        as: 'reviews'
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
    password: DataTypes.STRING,
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