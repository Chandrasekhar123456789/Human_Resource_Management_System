const { Organisation, User, Employee, Team, sequelize } = require('./models');
const bcrypt = require('bcrypt');

async function seed(){
  await sequelize.sync();
  const org = await Organisation.create({ name: 'Demo Org' });
  const hash = await bcrypt.hash('password',10);
  const user = await User.create({ name: 'Admin', email: 'admin@demo.local', password_hash: hash, organisationId: org.id });
  const emps = await Promise.all([
    Employee.create({ first_name:'Asha', last_name:'Patel', email:'asha@example.com', phone:'+91-9000000001', organisationId: org.id }),
    Employee.create({ first_name:'Ravi', last_name:'Kumar', email:'ravi@example.com', phone:'+91-9000000002', organisationId: org.id }),
    Employee.create({ first_name:'Sunita', last_name:'Shah', email:'sunita@example.com', phone:'+91-9000000003', organisationId: org.id })
  ]);
  const teams = await Promise.all([
    Team.create({ name:'Product', description:'Product team', organisationId: org.id }),
    Team.create({ name:'Design', description:'Design & UX', organisationId: org.id })
  ]);
  // assign employees
  await teams[0].addEmployee(emps[0]);
  await teams[0].addEmployee(emps[1]);
  await teams[1].addEmployee(emps[2]);
  console.log('Seed complete. Admin user: admin@demo.local / password');
  process.exit(0);
}

seed().catch(e=>{
  console.error(e);
  process.exit(1);
});
