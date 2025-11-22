const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');
const { Team, Employee, EmployeeTeam } = require('../models');
const { writeLog } = require('../utils/logger');
router.use(authMiddleware);

router.get('/', async (req,res)=>{
  const teams = await Team.findAll({ where:{ organisationId: req.user.orgId }, include: Employee });
  res.json(teams);
});

router.post('/', async (req,res)=>{
  const { name, description } = req.body;
  const team = await Team.create({ name, description, organisationId: req.user.orgId });
  await writeLog({ organisationId: req.user.orgId, userId: req.user.id, action:'team_created', meta:{ teamId: team.id }});
  res.status(201).json(team);
});

router.put('/:id', async (req,res)=>{
  const team = await Team.findOne({ where:{ id:req.params.id, organisationId: req.user.orgId }});
  if(!team) return res.status(404).json({ message:'Not found' });
  await team.update(req.body);
  await writeLog({ organisationId: req.user.orgId, userId: req.user.id, action:'team_updated', meta:{ teamId: team.id }});
  res.json(team);
});

router.delete('/:id', requireRole('admin','manager'), async (req,res)=>{
  const team = await Team.findOne({ where:{ id:req.params.id, organisationId: req.user.orgId }});
  if(!team) return res.status(404).json({ message:'Not found' });
  await team.destroy();
  await writeLog({ organisationId: req.user.orgId, userId: req.user.id, action:'team_deleted', meta:{ teamId: req.params.id }});
  res.json({ ok:true });
});

// assign employee(s) to team (batch)
router.post('/:teamId/assign', async (req,res)=>{
  const { employeeIds } = req.body;
  const team = await Team.findOne({ where:{ id:req.params.teamId, organisationId: req.user.orgId }});
  if(!team) return res.status(404).json({ message:'Team not found' });
  const added = [];
  for(const eid of employeeIds || []){
    const emp = await Employee.findOne({ where:{ id:eid, organisationId: req.user.orgId }});
    if(emp){
      await team.addEmployee(emp);
      added.push(eid);
      await writeLog({ organisationId: req.user.orgId, userId: req.user.id, action:'employee_assigned', meta:{ employeeId: eid, teamId: team.id }});
    }
  }
  res.json({ added });
});

router.post('/:teamId/unassign', async (req,res)=>{
  const { employeeIds } = req.body;
  const team = await Team.findOne({ where:{ id:req.params.teamId, organisationId: req.user.orgId }});
  if(!team) return res.status(404).json({ message:'Team not found' });
  const removed=[];
  for(const eid of employeeIds || []){
    const emp = await Employee.findOne({ where:{ id:eid, organisationId: req.user.orgId }});
    if(emp){
      await team.removeEmployee(emp);
      removed.push(eid);
      await writeLog({ organisationId: req.user.orgId, userId: req.user.id, action:'employee_unassigned', meta:{ employeeId: eid, teamId: team.id }});
    }
  }
  res.json({ removed });
});

module.exports = router;
