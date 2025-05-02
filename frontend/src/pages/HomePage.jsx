import React, { useEffect, useState } from 'react';
import {
  fetchHomeData,
  addUser,
  removeUser,
  addGame,
  removeGame,
  disableRating,
  enableRating,
  disableComment,
  enableComment
} from '../api/api';
import '../index.css';

const HomePage = ({ aktifKullanici }) => {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedGameId, setSelectedGameId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newGameData, setNewGameData] = useState({
    name: '',
    genres: [],
    photo: '',
    optional_fields: {}
  });
  const [işlemMesajı, setIşlemMesajı] = useState('');

  const loadData = async () => {
    const data = await fetchHomeData();
    setUsers(data.users);
    setGames(data.games);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddUser = async () => {
    if (newUserName) {
      await addUser(newUserName);
      setNewUserName('');
      setIşlemMesajı(`Yeni kullanıcı "${newUserName}" başarıyla eklendi.`);
      loadData();
    }
  };

  const handleRemoveUser = async () => {
    if (selectedUserId) {
      if (selectedUserId === aktifKullanici._id) {
        setIşlemMesajı("Kendi hesabınızı silemezsiniz!");
        return;
      }
      
      await removeUser(selectedUserId);
      setIşlemMesajı("Kullanıcı başarıyla silindi.");
      loadData();
    }
  };

  const handleAddGame = async () => {
    if (newGameData.name && newGameData.genres.length && newGameData.photo) {
      await addGame(newGameData);
      setNewGameData({ name: '', genres: [], photo: '', optional_fields: {} });
      setIşlemMesajı(`Yeni oyun "${newGameData.name}" başarıyla eklendi.`);
      loadData();
    }
  };

  const handleRemoveGame = async () => {
    if (selectedGameId) {
      await removeGame(selectedGameId);
      setIşlemMesajı("Oyun başarıyla silindi.");
      loadData();
    }
  };

  const handleDisableRating = async () => {
    if (selectedGameId) {
      await disableRating(selectedGameId);
      setIşlemMesajı("Oyun için puanlama devre dışı bırakıldı.");
      loadData();
    }
  };

  const handleEnableRating = async () => {
    if (selectedGameId) {
      await enableRating(selectedGameId);
      setIşlemMesajı("Oyun için puanlama etkinleştirildi.");
      loadData();
    }
  };
  
  const handleDisableComment = async () => {
    if (selectedGameId) {
      await disableComment(selectedGameId);
      setIşlemMesajı("Oyun için yorum yapma devre dışı bırakıldı.");
      loadData();
    }
  };
  
  const handleEnableComment = async () => {
    if (selectedGameId) {
      await enableComment(selectedGameId);
      setIşlemMesajı("Oyun için yorum yapma etkinleştirildi.");
      loadData();
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🎮 Game Distribution Service</h1>
        <p>Hoşgeldin, {aktifKullanici.name}! Oyunları ekle, düzenle ve kullanıcıları yönet</p>
      </div>

      {işlemMesajı && (
        <div style={{ 
          padding: '10px', 
          margin: '15px 0', 
          backgroundColor: işlemMesajı.includes('silemezsiniz') ? '#ffecec' : '#e7f7e7',
          border: `1px solid ${işlemMesajı.includes('silemezsiniz') ? '#f5c6cb' : '#c3e6cb'}`,
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          {işlemMesajı}
        </div>
      )}

      <div className="dashboard">
        <section className="admin-card">
          <h2>👤 Kullanıcı İşlemleri</h2>
          <div className="input-group">
            <input
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Yeni kullanıcı adı"
              className="form-input"
            />
            <button className="btn btn-primary" onClick={handleAddUser}>Kullanıcı Ekle</button>
          </div>
          
          <div className="input-group mt-20">
            <select 
              onChange={(e) => setSelectedUserId(e.target.value)} 
              value={selectedUserId}
              className="form-select"
            >
              <option value="">Kullanıcı Seçin</option>
              {users.map((user) => (
                <option 
                  key={user._id} 
                  value={user._id} 
                  disabled={user._id === aktifKullanici._id}
                >
                  {user.name} {user._id === aktifKullanici._id ? '(Siz)' : ''}
                </option>
              ))}
            </select>
            <button 
              className="btn btn-danger" 
              onClick={handleRemoveUser}
              disabled={selectedUserId === aktifKullanici._id || !selectedUserId}
            >
              Kullanıcıyı Sil
            </button>
          </div>
        </section>

        <section className="admin-card">
          <h2>🎮 Oyun İşlemleri</h2>
          <div className="game-form">
            <div className="input-group">
              <input
                value={newGameData.name}
                onChange={(e) => setNewGameData({ ...newGameData, name: e.target.value })}
                placeholder="Oyun adı"
                className="form-input"
              />
            </div>
            
            <div className="input-group">
              <input
                value={newGameData.photo}
                onChange={(e) => setNewGameData({ ...newGameData, photo: e.target.value })}
                placeholder="Fotoğraf URL"
                className="form-input"
              />
            </div>
            
            <div className="input-group">
              <input
                placeholder="Türler (virgül ile ayırın)"
                onChange={(e) =>
                  setNewGameData({ ...newGameData, genres: e.target.value.split(',').map(g => g.trim()) })
                }
                className="form-input"
              />
            </div>
            
            <button className="btn btn-primary full-width" onClick={handleAddGame}>Oyun Ekle</button>
          </div>
          
          <div className="game-controls mt-20">
            <select 
              onChange={(e) => setSelectedGameId(e.target.value)} 
              value={selectedGameId}
              className="form-select"
            >
              <option value="">Oyun Seçin</option>
              {games.map((game) => (
                <option key={game._id} value={game._id}>{game.name}</option>
              ))}
            </select>
            
            <div className="button-group">
              <button className="btn btn-danger" onClick={handleRemoveGame} disabled={!selectedGameId}>Sil</button>
              <button className="btn btn-warning" onClick={handleDisableRating} disabled={!selectedGameId}>Puanlama Kapat</button>
              <button className="btn btn-success" onClick={handleEnableRating} disabled={!selectedGameId}>Puanlama Aç</button>
              <button className="btn btn-warning" onClick={handleDisableComment} disabled={!selectedGameId}>Yorum Kapat</button>
              <button className="btn btn-success" onClick={handleEnableComment} disabled={!selectedGameId}>Yorum Aç</button>
            </div>
          </div>
        </section>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h3>Toplam Kullanıcı</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Toplam Oyun</h3>
          <p className="stat-number">{games.length}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;