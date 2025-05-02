import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:5000';

const GamesPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/games`)
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

  return (
    <div className="game-card">
      <h1>🎮 Tüm Oyunlar</h1>

      {games.length === 0 ? (
        <p>Oyun bulunamadı.</p>
      ) : (
        games.map((game) => (
          <div
            key={game._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1rem'
            }}
          >
            <h2>{game.name}</h2>
            <img src={game.photo} alt={game.name} style={{ width: '150px' }} />
            <p><strong>Türler:</strong> {game.genres?.join(', ')}</p>
            <p><strong>Toplam Oynama:</strong> {game.play_time} saat</p>
            <p><strong>Puan:</strong> {game.rating?.toFixed(2) || 'Henüz yok'}</p>
            {game.optional_fields && Object.keys(game.optional_fields).length > 0 && (
              <div>
                <h4>🔍 Üretici</h4>
                <ul>
                  {Object.entries(game.optional_fields).map(([key, val]) => (
                    <li key={key}><strong>{key}:</strong> {val}</li>
                  ))}
                </ul>
              </div>
            )}

            {game.all_comments?.length > 0 && (
              <div>
                <h4>💬 Yorumlar</h4>
                <ul>
                  {game.all_comments
                    .sort((a, b) => b.play_time - a.play_time)
                    .map((c, i) => (
                      <li key={i}>
                        <strong>{c.user_name}:</strong> {c.comment} ({c.play_time} saat)
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GamesPage;
