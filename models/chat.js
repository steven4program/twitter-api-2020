'use strict'
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    'Chat',
    {
      UserId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      message: DataTypes.STRING,
      type: DataTypes.INTEGER
    },
    {}
  )
  Chat.associate = function (models) {
    // associations can be defined here
  }
  return Chat
}
