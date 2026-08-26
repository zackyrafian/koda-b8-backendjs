'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Roles.hasMany(models.User, {
        foreignKey: 'role_id',
        as: 'users'
      })
    }
  }
  Roles.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: [['ADMIN', 'USER']],
      },
    }
  }, {
    sequelize,
    modelName: 'Roles',
    tableName: 'roles',
    underscored: true,
  });
  return Roles;
};
