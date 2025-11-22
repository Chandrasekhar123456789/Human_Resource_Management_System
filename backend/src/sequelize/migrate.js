const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

async function run(){
  console.log('Running JS migrations via sequelize.sync (for demo)');
  try{
    await sequelize.sync({ alter: true });
    console.log('Sync complete');
    process.exit(0);
  }catch(e){
    console.error(e); process.exit(1);
  }
}

run();
