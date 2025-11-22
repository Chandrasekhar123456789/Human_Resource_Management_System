import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AssignModal({ onClose, employees, onAssign, team }){
  const [selected, setSelected] = useState([]);
  useEffect(()=> setSelected([]), [team]);
  function toggle(id){
    setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);
  }
  return (<div className="modal-backdrop">
    <motion.div className="modal" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:10,opacity:0}}>
      <h3>Assign to {team?.name}</h3>
      <div style={{maxHeight:240,overflow:'auto',marginTop:8}}>
        {employees.map(e=>(
          <label key={e.id} style={{display:'flex',alignItems:'center',gap:8,padding:8,borderRadius:8,background:'rgba(255,255,255,0.02)',marginBottom:6}}>
            <input type="checkbox" checked={selected.includes(e.id)} onChange={()=>toggle(e.id)} />
            <div><strong>{e.first_name} {e.last_name}</strong><div className="small muted">{e.email}</div></div>
          </label>
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginTop:12,justifyContent:'flex-end'}}>
        <button onClick={()=>{ onAssign(selected); onClose(); }}>Assign selected</button>
        <button className="small-btn" onClick={onClose}>Cancel</button>
      </div>
    </motion.div>
  </div>);
}
