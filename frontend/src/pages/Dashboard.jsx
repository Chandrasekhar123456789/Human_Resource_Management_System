import AssignModal from '../components/AssignModal';
import React, { useEffect, useState } from 'react';
import api from '../services/api';
export default function Dashboard({ onLogout, user }){
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [formEmp, setFormEmp] = useState({});
  const [formTeam, setFormTeam] = useState({});
  const [logs, setLogs] = useState([]);
  const [modal, setModal] = useState(null); // {type:'emp'|'team'|'assign', mode:'edit'|'create', data:...}
  useEffect(()=>{ fetchAll(); },[]);
  async function fetchAll(){
    try{
      const e = await api.get('/employees');
      const t = await api.get('/teams');
      const l = await api.get('/logs');
      setEmployees(e);
      setTeams(t);
      setLogs(l);
    }catch(e){
      console.error(e);
      alert('Fetch error');
    }
  }
  async function addEmp(e){ e.preventDefault();
    if(modal && modal.mode==='edit'){
      await api.put(`/employees/${modal.data.id}`, formEmp);
      setModal(null);
    } else {
      await api.post('/employees', formEmp);
    }
    setFormEmp({}); fetchAll();
  }
  async function addTeam(e){ e.preventDefault();
    if(modal && modal.mode==='edit'){
      await api.put(`/teams/${modal.data.id}`, formTeam);
      setModal(null);
    } else {
      await api.post('/teams', formTeam);
    }
    setFormTeam({}); fetchAll();
  }
  async function assign(teamId){ // assign selected employee ids (simple pick first)
    const eid = employees[0]?.id;
    if(!eid){ alert('No employee to assign'); return; }
    await api.post(`/teams/${teamId}/assign`, { employeeIds: [eid] });
    fetchAll();
  }
  async function removeEmployee(id){
    if(!confirm('Delete employee? This action cannot be undone.')) return;
    await api.del(`/employees/${id}`); fetchAll();
  }
  async function removeTeam(id){
    if(!confirm('Delete team? This action cannot be undone.')) return;
    await api.del(`/teams/${id}`); fetchAll();
  }
  function openEditEmp(emp){
    setModal({ type:'emp', mode:'edit', data: emp });
    setFormEmp({ first_name: emp.first_name, last_name: emp.last_name, email: emp.email, phone: emp.phone });
  }
  function openEditTeam(t){
    setModal({ type:'team', mode:'edit', data: t });
    setFormTeam({ name: t.name, description: t.description });
  }
  return (<div className="container">
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h1>Dashboard</h1>
      <div>
        <span className="small">Hi, {user.name}</span>
        <button onClick={async ()=>{ await api.post('/auth/logout'); onLogout(); }} style={{marginLeft:12}}>Logout</button>
      </div>
    </div>
    <div className="row" style={{marginTop:12}}>
      <div style={{flex:1}}>
        <div className="card">
          <h3>Employees</h3>
          <form onSubmit={addEmp} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <input placeholder="First name" value={formEmp.first_name||''} onChange={e=>setFormEmp({...formEmp, first_name:e.target.value})} />
            <input placeholder="Last name" value={formEmp.last_name||''} onChange={e=>setFormEmp({...formEmp, last_name:e.target.value})} />
            <input placeholder="Email" value={formEmp.email||''} onChange={e=>setFormEmp({...formEmp, email:e.target.value})} />
            <input placeholder="Phone" value={formEmp.phone||''} onChange={e=>setFormEmp({...formEmp, phone:e.target.value})} />
            <div style={{gridColumn:'1/-1',display:'flex',gap:8}}>
              <button type="submit">{modal && modal.type==='emp' && modal.mode==='edit' ? 'Save changes' : 'Add employee'}</button>
              <button type="button" onClick={()=>{ setFormEmp({}); setModal(null); }}>Clear</button>
            </div>
          </form>
          <div className="list">
            {employees.map(emp=>(<div key={emp.id} className="item">
              <strong>{emp.first_name} {emp.last_name}</strong>
              <div className="small">{emp.email} • {emp.phone}</div>
              <div className="small">Teams: {emp.Teams?.map(t=>t.name).join(', ') || <em>—</em>}</div>
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button className="small-btn" onClick={()=>openEditEmp(emp)}>Edit</button>
                <button className="small-btn" onClick={()=>removeEmployee(emp.id)}>Delete</button>
              </div>
            </div>))}
          </div>
        </div>
      </div>
      <div style={{width:360}}>
        <div className="card">
          <h3>Teams</h3>
          <form onSubmit={addTeam}>
            <input placeholder="Team name" value={formTeam.name||''} onChange={e=>setFormTeam({...formTeam, name:e.target.value})} />
            <textarea placeholder="Description" value={formTeam.description||''} onChange={e=>setFormTeam({...formTeam, description:e.target.value})} />
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button type="submit">{modal && modal.type==='team' && modal.mode==='edit' ? 'Save changes' : 'Add team'}</button>
              <button type="button" onClick={()=>setFormTeam({})}>Clear</button>
            </div>
          </form>
          <div style={{marginTop:12}}> 
              <button className='small-btn' onClick={()=>setModal({type:'emp',mode:'create'})}>New employee</button>

            {teams.map(t=>(
              <div key={t.id} className="item" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <div>
                  <strong>{t.name}</strong>
                  <div className="small muted">{t.description}</div>
                  <div className="small">Members: {t.Employees?.length || 0}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <button onClick={()=>assign(t.id)}>Assign first emp</button>
                  <div style={{display:'flex',gap:6}}>
                    <button className="small-btn" onClick={()=>openEditTeam(t)}>Edit</button>
                    <button className="small-btn" onClick={()=>removeTeam(t.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{marginTop:12}}>
          <h3>Recent logs</h3>
          <div style={{maxHeight:220,overflow:'auto'}}>
            {logs.map(l=>(
              <div key={l.id} className="item" style={{marginBottom:8}}>
                <div className="small">{new Date(l.createdAt).toLocaleString()}</div>
                <div><strong>{l.action}</strong></div>
                <div className="small muted">{JSON.stringify(l.meta)}</div>
              </div>
            ))}
          </div>
          <div className="small muted">Only the most recent logs are shown.</div>
        </div>
      </div>
    </div>
  </div>);
}
