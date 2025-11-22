const jwt = require('jsonwebtoken');
const { User, Organisation } = require('../models');
const secret = process.env.JWT_SECRET || 'secret_dev';
async function authMiddleware(req,res,next){
  const auth = req.headers.authorization || '';
  const token = auth.split(' ')[1];
  if(!token) return res.status(401).json({ message:'No token' });
  try{
    const payload = jwt.verify(token, secret);
    const user = await User.findByPk(payload.userId);
    if(!user) return res.status(401).json({ message:'Invalid user' });
    req.user = { id: user.id, name: user.name, orgId: user.organisationId, role: user.role };
    next();
  }catch(e){
    return res.status(401).json({ message:'Invalid token' });
  }
}
module.exports = { authMiddleware };
