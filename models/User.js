module.exports = (sequelize, DataTypes) => {
  sequelize.define('User', {
    name: DataTypes.STRING,
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
  });

  const {
    User, SessionToken, File, ApiKey,
  } = sequelize.models;

  User.hasMany(SessionToken, { as: 'token' });
  ApiKey.belongsTo(User);
  User.hasMany(ApiKey, { as: 'apiKeys' });
  SessionToken.belongsTo(User);
  File.belongsTo(User);
  User.hasMany(File, { as: 'file' });
  User.hasMany(File, { as: 'sharedFiles' });
  return sequelize;
};
