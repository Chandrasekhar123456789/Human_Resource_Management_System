const { Log } = require('../models');
async function writeLog({ organisationId, userId, action, meta }){
  try{
    await Log.create({ organisationId, userId, action, meta });
  }catch(e){
    console.error('Failed to write log', e);
  }
}
module.exports = { writeLog };
