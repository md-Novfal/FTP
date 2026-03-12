const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Commission = sequelize.define('Commission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  agencyId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: DataTypes.DECIMAL(12, 2),
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'paid'),
    defaultValue: 'pending',
  },
  approvedAt: DataTypes.DATE,
  approvedBy: DataTypes.UUID,
}, {
  tableName: 'commissions',
  timestamps: true,
  underscored: true,
});

module.exports = Commission;
