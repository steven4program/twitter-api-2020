'use strict'
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      account: DataTypes.STRING,
      avatar: DataTypes.STRING,
      cover: DataTypes.STRING,
      introduction: DataTypes.STRING
    },
    {}
  )
  Member.associate = function (models) {
    // associations can be defined here
  }
  return Member
}
