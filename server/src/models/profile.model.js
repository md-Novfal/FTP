const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  dateOfBirth: DataTypes.DATEONLY,
  fatherName: DataTypes.STRING,
  motherName: DataTypes.STRING,
  aadharNumber: DataTypes.STRING,
  panNumber: DataTypes.STRING,
  passportNumber: DataTypes.STRING,
  passportExpiry: DataTypes.DATEONLY,
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  pincode: DataTypes.STRING,
  // Academic
  tenthPercentage: DataTypes.DECIMAL(5, 2),
  twelfthPercentage: DataTypes.DECIMAL(5, 2),
  neetScore: DataTypes.INTEGER,
  ugDegree: DataTypes.STRING,
  ugPercentage: DataTypes.DECIMAL(5, 2),
  // Preferences
  preferredCountries: DataTypes.ARRAY(DataTypes.STRING),
  preferredCourses: DataTypes.ARRAY(DataTypes.STRING),
}, {
  tableName: 'profiles',
  timestamps: true,
  underscored: true,
});

module.exports = Profile;
