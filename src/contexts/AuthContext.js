import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [userNickname, setUserNickname] = useState(localStorage.getItem('nickname') || null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || null);
  const [userProfileImg, setUserProfileImgState] = useState(localStorage.getItem('userImg') || null);
  const [userIntroduce, setUserIntroduce] = useState(localStorage.getItem('userIntroduce') || null);

  const login = (token, id, nickname, email, userImg, introduce) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('email', email);
    localStorage.setItem('userImg', userImg);
    localStorage.setItem('userIntroduce', introduce);

    setIsLoggedIn(true);
    setUserId(id);
    setUserNickname(nickname);
    setUserEmail(email);
    setUserProfileImgState(userImg);
    setUserIntroduce(introduce);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    localStorage.removeItem('email');
    localStorage.removeItem('userImg');
    localStorage.removeItem('userIntroduce');

    setIsLoggedIn(false);
    setUserId(null);
    setUserNickname(null);
    setUserEmail(null);
    setUserProfileImgState(null);
    setUserIntroduce(null);
  };

  const updateProfileImg = (newImgPath) => {
    localStorage.setItem('userImg', newImgPath);
    setUserProfileImgState(newImgPath);
  };

  const value = {
    isLoggedIn,
    userId,
    userNickname,
    userEmail,
    userProfileImg,
    userIntroduce,
    login,
    logout,
    updateProfileImg,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};