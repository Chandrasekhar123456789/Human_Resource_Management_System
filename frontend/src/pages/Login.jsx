import React, { useState } from 'react';
import api from '../services/api';
export default function Login({ onLogin }){
  const [mode, setMode] = useState('login'); // or register
  const [form, setForm] = useState({});
  async function submit(e){
    e.preventDefault();
    try{
      if(mode==='login'){
        const res = await api.post('/auth/login', form);
        onLogin(res);
      }else{
        const res = await api.post('/auth/register', { orgName: form.orgName, adminName: form.name, email: form.email, password: form.password });
        onLogin(res);
      }
    }catch(e){
      alert(e?.response?.data?.message || e.message);
    }
  }
  return (<div className="container"><div className="card" style={{maxWidth:600, margin:'40px auto'}}>
    <nav><h1>HRMS</h1><div className="small">Simple HRMS</div></nav>
    <form onSubmit={submit}>
      {mode==='register' && <input placeholder="Organisation name" onChange={e=>setForm({...form, orgName:e.target.value})} />}
      {mode==='register' && <input placeholder="Your name" onChange={e=>setForm({...form, name:e.target.value})} />}
      <input placeholder="Email" onChange={e=>setForm({...form, email:e.target.value})} />
      <input placeholder="Password" type="password" onChange={e=>setForm({...form, password:e.target.value})} />
      <div style={{display:'flex',gap:8, marginTop:8}}>
        <button type="submit">{mode==='login'?'Login':'Register'}</button>
        <button type="button" onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Create org':'Have an account?'}</button>
      </div>
    </form>
    <p className="muted small">Tip: register to create an organisation and admin user. This demo uses SQLite for convenience.</p>
  </div></div>);
}
