import '../index.css';

const BASE_URL = 'http://127.0.0.1:5000/api';

export const fetchHomeData = async () => {
  const res = await fetch(`${BASE_URL}/home`);
  return res.json();
};

export const addUser = async (name) => {
  const res = await fetch(`${BASE_URL}/add_user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const removeUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/remove_user/${userId}`, {
    method: 'DELETE',
  });
  return res.json();
};

export const addGame = async (gameData) => {
  const res = await fetch(`${BASE_URL}/add_game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameData),
  });
  return res.json();
};

export const removeGame = async (gameId) => {
  const res = await fetch(`${BASE_URL}/remove_game/${gameId}`, {
    method: 'DELETE',
  });
  return res.json();
};

export const disableRating = async (gameId) => {
  return fetch(`${BASE_URL}/disable_rating/${gameId}`, {
    method: 'PUT',
  });
};

export const enableRating = async (gameId) => {
  return fetch(`${BASE_URL}/enable_rating/${gameId}`, {
    method: 'PUT',
  });
};

export const disableComment = async (gameId) => {
  return fetch(`${BASE_URL}/disable_comment/${gameId}`, {
    method: 'PUT',
  });
};

export const enableComment = async (gameId) => {
  return fetch(`${BASE_URL}/enable_comment/${gameId}`, {
    method: 'PUT',
  });
};