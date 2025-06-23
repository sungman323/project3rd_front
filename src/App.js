import './App.css';
import React, { useState } from 'react';
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Header from './component/Header';
import Main from './component/Main';
import Login from './component/Login';
import Signin from './component/Signin';
import Profile from './component/Profile';
import ProfileUpdate from './component/ProfileUpdate';
import UserInfo from './component/UserInfo';
import Upload from './component/Upload';
import Detail from './component/Detail';
import Edit from './component/Edit';
import Footer from './component/Footer';

function DetailModalWrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    navigate(location.state?.from || '/', { replace: true });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={handleClose}>닫기</button>
        <Detail />
      </div>
    </div>
  );
}


function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <>
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        search={search}
        setSearch={setSearch}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Main
              userId={null}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              search={search}
              setSearch={setSearch}
            />
          }
        >
          <Route path="/detail/:p_id" element={<DetailModalWrapper />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/UserInfo/:id" element={<UserInfo />} />
        <Route path="/profileupdate/:id" element={<ProfileUpdate />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/edit/:id" element={<Edit />} />

        <Route path="*" element={<div>페이지를 찾을 수 없습니다 (404)</div>} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;