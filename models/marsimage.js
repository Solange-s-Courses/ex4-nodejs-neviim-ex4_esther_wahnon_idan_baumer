'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MarsImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  MarsImage.init({
    img_src: DataTypes.STRING,
    pic_id: DataTypes.INTEGER,
    sol: DataTypes.INTEGER,
    earth_date: DataTypes.DATEONLY,
    camera: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MarsImage',
  });
  return MarsImage;
};