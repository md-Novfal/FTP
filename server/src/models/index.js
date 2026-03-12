const { sequelize } = require('../config/database');
const User = require('./user.model');
const Profile = require('./profile.model');
const Application = require('./application.model');
const Document = require('./document.model');
const Notification = require('./notification.model');
const Commission = require('./commission.model');
const AuditLog = require('./auditLog.model');
const ChatMessage = require('./chatMessage.model');

// Associations
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'userId', as: 'student' });

Application.hasMany(Document, { foreignKey: 'applicationId', as: 'documents' });
Document.belongsTo(Application, { foreignKey: 'applicationId' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Commission, { foreignKey: 'agencyId', as: 'commissions' });
Commission.belongsTo(User, { foreignKey: 'agencyId', as: 'agency' });

module.exports = {
  sequelize,
  User,
  Profile,
  Application,
  Document,
  Notification,
  Commission,
  AuditLog,
  ChatMessage,
};
