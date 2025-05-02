import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000';

const UserPage = ({ aktifKullanici }) => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [playTime, setPlayTime] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [işlemMesajı, setIşlemMesajı] = useState('');

  // Kullanıcının kendi profili mi yoksa başka kullanıcı mı kontrol et
  const isOwnProfile = aktifKullanici._id === userId;

  useEffect(() => {
    fetch(`${BASE_URL}/user/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));

    fetch(`${BASE_URL}/games`)
      .then(res => res.json())
      .then(data => setGames(data));
  }, [userId]);

  const handlePlay = async () => {
    if (!isOwnProfile) {
      setIşlemMesajı('Sadece kendi hesabınızda oyun oynayabilirsiniz.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/${aktifKullanici._id}/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: selectedGame, play_time: parseInt(playTime) })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.location.reload();
      } else {
        setIşlemMesajı(`Hata: ${data.error || 'Bir sorun oluştu.'}`);
      }
    } catch (error) {
      setIşlemMesajı('Bir hata oluştu: ' + error.message);
    }
  };

  const handleRate = async () => {
    if (!isOwnProfile) {
      setIşlemMesajı('Sadece kendi hesabınızda oyunları puanlayabilirsiniz.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/${aktifKullanici._id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: selectedGame, rating: parseInt(rating) })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.location.reload();
      } else {
        setIşlemMesajı(`Hata: ${data.error || 'Bir sorun oluştu.'}`);
      }
    } catch (error) {
      setIşlemMesajı('Bir hata oluştu: ' + error.message);
    }
  };

  const handleComment = async () => {
    if (!isOwnProfile) {
      setIşlemMesajı('Sadece kendi hesabınızda yorum yapabilirsiniz.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/${aktifKullanici._id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: selectedGame, comment })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.location.reload();
      } else {
        setIşlemMesajı(`Hata: ${data.error || 'Bir sorun oluştu.'}`);
      }
    } catch (error) {
      setIşlemMesajı('Bir hata oluştu: ' + error.message);
    }
  };

  if (!user) return <p>Yükleniyor...</p>;

  return (
    <div className="container">
      <h1>{user.name} 🧑‍💻 {isOwnProfile && "(Sizin profiliniz)"}</h1>
      <p>Toplam Oynama Süresi: {user.total_play_time} saat</p>
      <p>Ortalama Puan: {user.average_rating?.toFixed(2) || 'Yok'}</p>
      <p>En Çok Oynadığı Oyun: {user.most_played_game_name || 'Yok'}</p>

      <h2>🎮 Yorumlar:</h2>
      <ul>
        {user.comments?.map((c, i) => (
          <li key={i}><strong>{c.game_name}:</strong> {c.comment}</li>
        ))}
      </ul>

      {işlemMesajı && (
        <div style={{ 
          padding: '10px', 
          margin: '15px 0', 
          backgroundColor: işlemMesajı.includes('Hata') ? '#ffecec' : '#e7f7e7',
          border: `1px solid ${işlemMesajı.includes('Hata') ? '#f5c6cb' : '#c3e6cb'}`,
          borderRadius: '5px'
        }}>
          {işlemMesajı}
        </div>
      )}

      <hr />

      {isOwnProfile ? (
        <>
          <h2>🎯 İşlemler</h2>
          <select onChange={(e) => setSelectedGame(e.target.value)} defaultValue="">
            <option value="" disabled>Oyun Seçin</option>
            {games.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
          </select>
          <br /><br />

          <label>
            Oynama Süresi (saat):
            <input type="number" value={playTime} onChange={(e) => setPlayTime(e.target.value)} min="1" />
            <button onClick={handlePlay}>Oyna</button>
          </label>

          <br /><br />
          <label>
            Puan (1-5):
            <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" />
            <button onClick={handleRate}>Puan Ver</button>
          </label>

          <br /><br />
          <label>
            Yorum:
            <input value={comment} onChange={(e) => setComment(e.target.value)} />
            <button onClick={handleComment}>Yorum Yap</button>
          </label>
        </>
      ) : (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <p>Bu kullanıcının profilini görüntülüyorsunuz. İşlem yapmak için kendi profilinize gidin.</p>
        </div>
      )}
    </div>
  );
};

export default UserPage;