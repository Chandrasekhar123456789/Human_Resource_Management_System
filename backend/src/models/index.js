const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const storage = process.env.DATABASE_STORAGE || path.join(__dirname,'..','..','database.sqlite');
const sequelize = new Sequelize({ dialect:'sqlite', storage, logging:false });
const Organisation = sequelize.define('Organisation', {
  name:{ type: DataTypes.STRING, allowNull:false }
});
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, allowNull:false, unique:true },
  password_hash: { type: DataTypes.STRING, allowNull:false }
});
const Employee = sequelize.define('Employee', {
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING
});
const Team = sequelize.define('Team', {
  name: { type: DataTypes.STRING, allowNull:false },
  description: DataTypes.TEXT
});
const EmployeeTeam = sequelize.define('EmployeeTeam', {
  assigned_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
});
const Log = sequelize.define('Log', {
  action: { type: DataTypes.STRING },
  meta: { type: DataTypes.JSON }
});
// Associations
Organisation.hasMany(User, { foreignKey: 'organisationId' });
User.belongsTo(Organisation, { foreignKey: 'organisationId' });
Organisation.hasMany(Employee, { foreignKey: 'organisationId' });
Employee.belongsTo(Organisation, { foreignKey: 'organisationId' });
Organisation.hasMany(Team, { foreignKey: 'organisationId' });
Team.belongsTo(Organisation, { foreignKey: 'organisationId' });
Employee.belongsToMany(Team, { through: EmployeeTeam, foreignKey:'employeeId' });
Team.belongsToMany(Employee, { through: EmployeeTeam, foreignKey:'teamId' });
Log.belongsTo(Organisation, { foreignKey: 'organisationId' });
Log.belongsTo(User, { foreignKey: 'userId' });
module.exports = { sequelize, Sequelize, Organisation, User, Employee, Team, EmployeeTeam, Log };
