import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [dang_tai, setDangTai] = useState(true);

  useEffect(() => {
    const token_luu = localStorage.getItem('token');
    const user_luu = localStorage.getItem('user');
    if (token_luu && user_luu) {
      setToken(token_luu);
      setUser(JSON.parse(user_luu));
    }
    setDangTai(false);
  }, []);

  const dang_nhap = (token_moi, user_moi) => {
    setToken(token_moi);
    setUser(user_moi);
    localStorage.setItem('token', token_moi);
    localStorage.setItem('user', JSON.stringify(user_moi));
  };

  const dang_xuat = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, dang_nhap, dang_xuat, dang_tai }}>
      {children}
    </AuthContext.Provider>
  );
}
