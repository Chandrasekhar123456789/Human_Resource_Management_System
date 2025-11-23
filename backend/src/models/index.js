require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});



// MODELS
const Organisation = sequelize.define('Organisation', {
  name: { type: DataTypes.STRING, allowNull: false }
});

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false }
});

const Employee = sequelize.define('Employee', {
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING
});

const Team = sequelize.define('Team', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT
});

const EmployeeTeam = sequelize.define('EmployeeTeam', {
  assigned_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
});

const Log = sequelize.define('Log', {
  action: { type: DataTypes.STRING },
  meta: { type: DataTypes.JSON }
});

// ASSOCIATIONS
Organisation.hasMany(User);
User.belongsTo(Organisation);

Organisation.hasMany(Employee);
Employee.belongsTo(Organisation);

Organisation.hasMany(Team);
Team.belongsTo(Organisation);

Employee.belongsToMany(Team, { through: EmployeeTeam });
Team.belongsToMany(Employee, { through: EmployeeTeam });

Log.belongsTo(Organisation);
Log.belongsTo(User);

module.exports = { sequelize, Sequelize, Organisation, User, Employee, Team, EmployeeTeam, Log };
