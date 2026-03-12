const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  message: DataTypes.TEXT,
  readAt: DataTypes.DATE,
}, {
  tableName: 'chat_messages',
  timestamps: true,
  underscored: true,
});

module.exports = ChatMessage;
