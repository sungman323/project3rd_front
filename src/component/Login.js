import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import '../css/form.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Login(props) {
  const [formData, setFormData] = useState({email:'', password:''});

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]:e.target.value});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post(`${API_BASE}/login`, formData);
      localStorage.setItem('token', res.data.token);

      const decoded = jwtDecode(res.data.token);
      if (props.setNickname) props.setNickname(decoded.nickname);
      if (props.setEmail) props.setEmail(decoded.email);
      if (props.setUserId) props.setUserId(decoded.id);
      if (props.setUserImg) props.setUserImg(decoded.img);

      window.location.href = '/';
    } catch(err) {
      alert('로그인 정보를 확인해주세요.')
      return;
    }

  }

  return (
    <section className='form'>
      <h2 className='form_title'>로그인</h2>
      <p className='explain'>지금 로그인 하고 더 다양한 디자인들을 둘러보고 공유하세요!</p>
      <form className='login' onSubmit={handleSubmit}>
        <p className='email'>
          <label htmlFor="email">이메일</label>
          <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} placeholder='이메일을 입력하세요' required/>
        </p>
        <p className='password'>
          <label htmlFor="password">비밀번호</label>
          <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} placeholder='비밀번호를 입력하세요' required/>
        </p>
        <p className='search'>
          아이디 찾기 | 비밀번호 찾기 |&nbsp;
          <Link to='/signin'>회원가입</Link>
        </p>
        <p>
          <button type='submit'>로그인</button>
        </p>
      </form>
      <hr />
      <div className='simple_login'>
        <h3>간편로그인</h3>
        <ul>
          <li><img src={`${process.env.PUBLIC_URL}/images/kakao.png`} alt='카카오' /></li>
          <li><img src={`${process.env.PUBLIC_URL}/images/google.png`} alt='구글' /></li>
          <li><img src={`${process.env.PUBLIC_URL}/images/naver.png`} alt='네이버' /></li>
          <li><img src={`${process.env.PUBLIC_URL}/images/apple.png`} alt='애플' /></li>
        </ul>
      </div>
    </section>
  );
}

export default Login;