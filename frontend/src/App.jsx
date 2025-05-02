import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import GamesPage from './pages/GamesPage';
import UsersListPage from './pages/UsersListPage';
import LoginPage from './pages/LoginPage';
import { useEffect, useState } from 'react';

function App() {
  const [aktifKullanici, setAktifKullanici] = useState(null);
  
  // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgisini al
  useEffect(() => {
    const kaydedilmisKullanici = localStorage.getItem('aktifKullanici');
    if (kaydedilmisKullanici) {
      setAktifKullanici(JSON.parse(kaydedilmisKullanici));
    }
  }, []);
  
  // Giriş fonksiyonu
  const kullaniciGirisYap = (kullanici) => {
    setAktifKullanici(kullanici);
    localStorage.setItem('aktifKullanici', JSON.stringify(kullanici));
  };
  
  // Çıkış fonksiyonu
  const kullaniciCikisYap = () => {
    setAktifKullanici(null);
    localStorage.removeItem('aktifKullanici');
  };

  return (
    <Router>
      <Navbar aktifKullanici={aktifKullanici} kullaniciCikisYap={kullaniciCikisYap} />
      <Routes>
        <Route path="/login" element={
          aktifKullanici ? 
            <Navigate to="/" /> : 
            <LoginPage kullaniciGirisYap={kullaniciGirisYap} />
        } />
        <Route path="/" element={
          aktifKullanici ? 
            <HomePage aktifKullanici={aktifKullanici} /> : 
            <Navigate to="/login" />
        } />
        <Route path="/user" element={
          aktifKullanici ? 
            <UsersListPage /> : 
            <Navigate to="/login" />
        } />
        <Route path="/user/:userId" element={
          aktifKullanici ? 
            <UserPage aktifKullanici={aktifKullanici} /> : 
            <Navigate to="/login" />
        } />
        <Route path="/games" element={
          aktifKullanici ? 
            <GamesPage aktifKullanici={aktifKullanici} /> : 
            <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;