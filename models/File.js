module.exports = (sequelize, DataTypes) => {
  sequelize.define('File', {
    name: { type: DataTypes.STRING },
    private: { type: DataTypes.BOOLEAN },
    size: { type: DataTypes.INTEGER },
    md5: { type: DataTypes.STRING },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['name', 'UserId'],
      },
    ],
  });
  return sequelize;
};
