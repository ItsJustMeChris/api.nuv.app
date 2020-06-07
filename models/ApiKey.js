module.exports = (sequelize, DataTypes) => {
  sequelize.define('ApiKey', {
    key: { type: DataTypes.STRING, unique: true },
    ip: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
  });
  return sequelize;
};
