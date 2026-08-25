'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserAddress.belongsTo(models.User, { 
        foreignKey: 'user_id', 
        as: 'user'
      })
    }
  }
  UserAddress.init({
    user_id: DataTypes.INTEGER,
    recipient_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    recipient_email: { 
      type: DataTypes.STRING, 
      validate: { 
        isEmail: true,
      }
    },
    recipient_address_full: DataTypes.STRING,
    recipient_city: DataTypes.STRING,
    recipient_province: DataTypes.STRING,
    zip_code: { 
      type: DataTypes.STRING, 
      validate: { is: /^[0-9]{5}$/}
    }
  }, {
    sequelize,
    modelName: 'UserAddress',
    tableName: 'user_address', 
    underscored: true,
  });
  return UserAddress;
};