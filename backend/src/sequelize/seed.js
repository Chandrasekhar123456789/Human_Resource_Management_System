const { Organisation, User, Employee, Team, sequelize } = require('../models');
const bcrypt = require('bcryptjs');


async function seed(){
  await sequelize.sync();
  const org = await Organisation.create({ name: 'Demo Org' });
  const hash = await bcrypt.hash('password',10);
  // roles: admin, manager, staff
  const admin = await User.create({ name:'Admin', email:'admin@demo.local', password_hash:hash, organisationId: org.id, role:'admin' });
  const mgr = await User.create({ name:'Manager', email:'manager@demo.local', password_hash:hash, organisationId: org.id, role:'manager' });
  const staff = await User.create({ name:'Staff', email:'staff@demo.local', password_hash:hash, organisationId: org.id, role:'staff' });
  const e1 = await Employee.create({ first_name:'Asha', last_name:'Patel', email:'asha@example.com', phone:'+91-9000000001', organisationId: org.id });
  const e2 = await Employee.create({ first_name:'Ravi', last_name:'Kumar', email:'ravi@example.com', phone:'+91-9000000002', organisationId: org.id });
  const t1 = await Team.create({ name:'Product', description:'Product team', organisationId: org.id });
  await t1.addEmployee(e1); await t1.addEmployee(e2);
  console.log('Seeded demo org with admin/manager/staff (password: password)');
  process.exit(0);
}

seed().catch(e=>{ console.error(e); process.exit(1); });
