const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: DataTypes.UUID,
  action: DataTypes.STRING,
  resource: DataTypes.STRING,
  resourceId: DataTypes.UUID,
  ipAddress: DataTypes.STRING,
  userAgent: DataTypes.STRING,
}, {
  tableName: 'audit_logs',
  timestamps: true,
  underscored: true,
  updatedAt: false,
});

module.exports = AuditLog;
