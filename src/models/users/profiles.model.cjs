'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserProfile.belongsTo(models.User, { 
        foreignKey: 'user_id', 
        as: 'user'
      })
    }
  }
  UserProfile.init({
    user_id: DataTypes.INTEGER,
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      validate: {
        is: /^[0-9+\-]{9,15}$/,
      },
    },
    date_of_birth: {
      type: DataTypes.STRING,
      validate: {
        isDate: true,
      },
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['LAKI-LAKI', 'PEREMPUAN', 'OTHER']],
      },
    },
    image_profile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    underscored: true,
  });
  return UserProfile;
};