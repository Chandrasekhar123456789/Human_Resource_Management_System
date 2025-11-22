const fs = require('fs');
const path = require('path');
const { sequelize } = require('./models');

async function runMigrations(){
  const migrDir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(migrDir).filter(f => f.endsWith('.sql')).sort();
  console.log('Found migrations:', files);
  // simple migrations table
  await sequelize.query("CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY, run_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
  for(const f of files){
    const name = f;
    const [exists] = await sequelize.query("SELECT name FROM migrations WHERE name = ?", { replacements:[name] });
    if(exists && exists.length>0){
      console.log('Skipping', name);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrDir,f), 'utf-8');
    console.log('Running', name);
    await sequelize.query(sql);
    await sequelize.query("INSERT INTO migrations (name) VALUES (?)", { replacements:[name] });
  }
  console.log('Migrations complete');
  process.exit(0);
}

runMigrations().catch(err=>{
  console.error(err);
  process.exit(1);
});
