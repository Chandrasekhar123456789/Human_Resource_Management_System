const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');
const { Employee, Organisation, Team } = require('../models');
const { writeLog } = require('../utils/logger');

router.use(authMiddleware);

router.get('/', async (req,res)=>{
  const list = await Employee.findAll({ where:{ organisationId: req.user.orgId }, include: Team });
  res.json(list);
});

router.post('/', async (req,res)=>{
  const { first_name, last_name, email, phone } = req.body;
  const emp = await Employee.create({ first_name, last_name, email, phone, organisationId: req.user.orgId });
  await writeLog({ organisationId: req.user.orgId, userId: req.user.id, action:'employee_created', meta:{ employeeId: emp.id }});
  res.status(201).json(emp);
});

router.get('/:id', async (req,res)=>{
  const emp = await Employee.findOne({ where:{ id:req.params.id, organisationId: req.user.orgId }, include: Team });
  if(!emp) return res.status(404).json({ message:'Not found' });
  res.json(emp);
});

router.put('/:id', async (req,res)=>{
  const emp = await Employee.findOne({ where:{ id:req.params.id, organisationId: req.user.orgId }});
  if(!emp) return res.status(404).json({ message:'Not found' });
  await emp.update(req.body);
  await writeLog({ organisationId: req.user.orgId, userId: req.user.id, action:'employee_updated', meta:{ employeeId: emp.id }});
  res.json(emp);
});

router.delete('/:id', requireRole('admin','manager'), async (req,res)=>{
  const emp = await Employee.findOne({ where:{ id:req.params.id, organisationId: req.user.orgId }});
  if(!emp) return res.status(404).json({ message:'Not found' });
  await emp.destroy();
  await writeLog({ organisationId: req.user.orgId, userId: req.user.id, action:'employee_deleted', meta:{ employeeId: req.params.id }});
  res.json({ ok:true });
});

module.exports = router;
