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
    fullname: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    date_of_birth: DataTypes.DATEONLY,
    gender: DataTypes.ENUM('LAKI-LAKI', 'PEREMPUAN', 'OTHER'),
    image_profile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    underscored: true,
  });
  return UserProfile;
};