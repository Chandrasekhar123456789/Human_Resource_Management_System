const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const { Log } = require('../models');
router.use(authMiddleware);

router.get('/', async (req,res)=>{
  const logs = await Log.findAll({ where:{ organisationId: req.user.orgId }, order:[['createdAt','DESC']], limit:200 });
  res.json(logs);
});

module.exports = router;
