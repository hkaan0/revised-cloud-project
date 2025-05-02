import { createContext, useState, useEffect } from 'react';

// Context oluşturma
export const UserContext = createContext();

// Provider bileşeni
export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  // Sayfa yüklendiğinde localStorage'dan kullanıcıyı al
  useEffect(() => {
    const kaydedilmisKullanici = localStorage.getItem('loggedInUser');
    if (kaydedilmisKullanici) {
      setLoggedInUser(JSON.parse(kaydedilmisKullanici));
    }
  }, []);
  
  // Giriş yapma fonksiyonu
  const girisYap = (kullanici) => {
    setLoggedInUser(kullanici);
    localStorage.setItem('loggedInUser', JSON.stringify(kullanici));
  };
  
  // Çıkış yapma fonksiyonu
  const cikisYap = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
  };
  
  return (
    <UserContext.Provider value={{ loggedInUser, girisYap, cikisYap }}>
      {children}
    </UserContext.Provider>
  );
};