import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const BASE_URL = 'http://localhost:5000';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/home`);
      if (!response.ok) {
        throw new Error('Kullanıcı verileri alınamadı');
      }
      const data = await response.json();
      setUsers(data.users);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Kullanıcılar yükleniyor...</div>;
  if (error) return <div className="container">Hata: {error}</div>;

  return (
    <div className="container">
      <h1>👥 Kullanıcılar</h1>
      
      {users.length === 0 ? (
        <p>Henüz kullanıcı bulunmuyor.</p>
      ) : (
        <div className="users-grid">
          {users.map(user => (
            <Link to={`/user/${user._id}`} key={user._id} className="user-card">
              <h3>{user.name}</h3>
              <div className="user-details">
                <p>Toplam Oynama: {user.total_play_time || 0} saat</p>
                <p>Ortalama Puan: {user.average_rating?.toFixed(2) || 'Yok'}</p>
                {user.most_played_game_name && <p>En çok: {user.most_played_game_name}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersListPage;