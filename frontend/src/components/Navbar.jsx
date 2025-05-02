import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ aktifKullanici, kullaniciCikisYap }) => (
  <nav className="navbar">
    <div className="navbar-logo">🎮 GameApp</div>
    <div className="navbar-links">
      {aktifKullanici ? (
        <>
          <Link to="/">Ana Sayfa</Link>
          <Link to="/games">Oyunlar</Link>
          <Link to="/user">Kullanıcılar</Link>
          <Link to={`/user/${aktifKullanici._id}`}>Profilim</Link>
          <span className="navbar-user">
            Merhaba, {aktifKullanici.name}! 
            <button onClick={kullaniciCikisYap} className="logout-btn">Çıkış Yap</button>
          </span>
        </>
      ) : (
        <Link to="/login">Giriş Yap</Link>
      )}
    </div>
  </nav>
);

export default Navbar;