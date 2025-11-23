require('dotenv').config({ path: './backend/.env' });

const { sequelize } = require('./backend/src/models');

sequelize.authenticate()
  .then(() => console.log("Connected to PostgreSQL!"))
  .catch(err => console.error("DB Error:", err));


