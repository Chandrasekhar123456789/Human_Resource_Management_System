function requireRole(...allowed){
  return (req,res,next)=>{
    const role = req.user?.role || 'staff';
    if(allowed.includes(role) || allowed.includes('*')) return next();
    return res.status(403).json({ message:'Forbidden - insufficient role' });
  };
}
module.exports = { requireRole };
