import React, { useEffect, useState } from 'react';
import '../index.css';

const BASE_URL = 'http://localhost:5000/api';

const LoginPage = ({ kullaniciGirisYap }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tüm kullanıcıları getir
    fetch(`${BASE_URL}/home`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch(err => {
        console.error("Kullanıcılar yüklenirken hata:", err);
        setLoading(false);
      });
  }, []);

  const handleLogin = () => {
    if (!selectedUser) return;
    
    const user = users.find(u => u._id === selectedUser);
    if (user) {
      kullaniciGirisYap(user);
    }
  };

  if (loading) return <div className="container">Kullanıcılar yükleniyor...</div>;

  return (
    <div className="container">
      <div className="login-container">
        <h1>🎮 Game App'e Hoşgeldiniz</h1>
        <h2>Lütfen bir kullanıcı seçin</h2>
        
        <div className="input-group">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="form-select"
          >
            <option value="">Kullanıcı Seçiniz</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>
        
        <button 
          className="btn btn-primary full-width" 
          onClick={handleLogin}
          disabled={!selectedUser}
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

export default LoginPage;