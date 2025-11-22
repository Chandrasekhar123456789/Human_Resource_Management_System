import React, { useState, useEffect } from 'react';
import api from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')||'null'));

  useEffect(()=>{
    api.setToken(token);
  },[token]);

  if(!token) return <Login onLogin={({token,user})=>{ setToken(token); setUser(user); localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); }} />;

  return <Dashboard onLogout={()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }} user={user} />;
}
