const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User } = require('../models');
const { writeLog } = require('../utils/logger');
const secret = process.env.JWT_SECRET || 'secret_dev';

router.post('/register', async (req,res)=> {
  const { orgName, adminName, email, password } = req.body;
  if(!orgName || !email || !password) return res.status(400).json({ message:'missing fields' });
  try{
    const org = await Organisation.create({ name: orgName });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: adminName || email.split('@')[0], email, password_hash: hash, organisationId: org.id });
    const token = jwt.sign({ userId: user.id, orgId: org.id }, secret, { expiresIn:'8h' });
    await writeLog({ organisationId: org.id, userId: user.id, action: 'user_registered', meta: { userId: user.id }});
    return res.json({ token, user:{ id:user.id, name:user.name, email:user.email }});
  }catch(e){
    console.error(e);
    return res.status(500).json({ message:'error creating account', error: e.message });
  }
});

router.post('/login', async (req,res)=> {
  const { email, password } = req.body;
  try{
    const user = await User.findOne({ where:{ email }});
    if(!user) return res.status(401).json({ message:'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(401).json({ message:'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, orgId: user.organisationId }, secret, { expiresIn:'8h' });
    await writeLog({ organisationId: user.organisationId, userId: user.id, action:'user_logged_in', meta:{} });
    return res.json({ token, user:{ id:user.id, name:user.name, email:user.email }});
  }catch(e){
    console.error(e);
    return res.status(500).json({ message:'server error' });
  }
});

router.post('/logout', async (req,res)=> {
  // For stateless JWT we can't invalidate easily here; still write a log if token provided
  const auth = req.headers.authorization || '';
  const token = auth.split(' ')[1];
  try{
    if(token){
      const payload = jwt.verify(token, secret);
      await writeLog({ organisationId: payload.orgId, userId: payload.userId, action:'user_logged_out', meta:{} });
    }
  }catch(e){}
  return res.json({ ok:true });
});

module.exports = router;
