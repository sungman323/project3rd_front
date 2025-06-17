import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from './component/Header';
import Main from './component/Main';
import Login from './component/Login';
import Signin from './component/Signin';
import Profile from './component/Profile';
import UserInfo from './component/UserInfo';
import Upload from './component/Upload';
import Detail from './component/Detail';
import Edit from './component/Edit';
import Footer from './component/Footer';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function App() {

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [userImg, setUserImg] = useState('');

  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setNickname(decoded.nickname);
        setEmail(decoded.email);
        setUserId(decoded.id);
        setUserImg(decoded.img);
      } catch (e) {
        setNickname('');
        setEmail('');
        setUserId('');
        setUserImg('');
      }
    }
  }, []);

  return (
    <>
      <Header nickname={nickname} userImg={userImg} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} search={search} setSearch={setSearch} />

      {/* 실제 화면 라우터 */}
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Main userId={userId} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} search={search} setSearch={setSearch} />} />
        <Route path="/login" element={<Login setNickname={setNickname} setEmail={setEmail} setUserId={setUserId} setUserImg={setUserImg} />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile nickname={nickname} email={email} userId={userId} userImg={userImg} setUserImg={setUserImg} />} />
        <Route path="/UserInfo/:id" element={<UserInfo />} />
        <Route path="/upload" element={<Upload nickname={nickname} email={email} userId={userId} userImg={userImg} />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>

      {/* 모달용 라우터 */}
      {backgroundLocation && (
        <Routes>
          <Route path="/detail/:p_id" element={<Detail nickname={nickname} email={email} userId={userId} userImg={userImg} />} />
        </Routes>
      )}

      <Footer />
    </>
  );
}

export default App;