import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import '../css/form.css';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({email:'', password:''});

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]:e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post(`${API_BASE}/login`, formData);
      const decoded = jwtDecode(res.data.token);

      if (decoded.id && decoded.introduce !== undefined) {
        login(res.data.token, decoded.id, decoded.nickname, decoded.email, decoded.img, decoded.introduce);
      } else {
        console.error("JWT 토큰에 사용자 ID 또는 자기소개 정보가 포함되어 있지 않습니다.");
        alert("로그인 정보가 완전하지 않습니다. 관리자에게 문의하세요.");
        return;
      }

      navigate('/');
    } catch(err) {
      console.error("로그인 에러:", err.response ? err.response.data : err.message);
      alert('로그인 정보를 확인해주세요.');
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