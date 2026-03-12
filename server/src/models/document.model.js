const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  docType: {
    type: DataTypes.ENUM(
      'aadhar', 'pan', 'passport', 'birth_certificate',
      'tenth_marksheet', 'twelfth_marksheet', 'neet_scorecard',
      'ug_degree', 'other'
    ),
    allowNull: false,
  },
  fileName: DataTypes.STRING,
  s3Key: DataTypes.STRING,
  mimeType: DataTypes.STRING,
  verifiedByAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verifiedAt: DataTypes.DATE,
  verifiedBy: DataTypes.UUID,
}, {
  tableName: 'documents',
  timestamps: true,
  underscored: true,
});

module.exports = Document;
