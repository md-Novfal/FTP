const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const APPLICATION_STATUSES = [
  'apply',
  'under_review',
  'college_submitted',
  'offer_letter',
  'interview',
  'admission_letter',
  'ministry_order',
  'vfs',
  'visa',
  'ticket',
  'arrived',
  'rejected',
  'on_hold',
];

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  agencyId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  universityName: DataTypes.STRING,
  courseName: DataTypes.STRING,
  countryName: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM(...APPLICATION_STATUSES),
    defaultValue: 'apply',
  },
  adminNote: DataTypes.TEXT,
  submittedAt: DataTypes.DATE,
}, {
  tableName: 'applications',
  timestamps: true,
  underscored: true,
});

module.exports = Application;
