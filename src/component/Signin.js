import React, {useState} from 'react';
import '../css/form.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Signin(props) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email:'',
    password:'',
    password2:'',
    name:'',
    nickname:'',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(form.password !== form.password2){
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try{
      const res = await axios.post(`${API_BASE}/signin`,{
        email : form.email,
        password : form.password,
        name : form.name,
        nickname : form.nickname
      });
  
      if(res.data.success){
        setError('');
        setForm({ email:'',  password:'',  password2:'', name:'', nickname:''});

        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
      }
    }catch(err){
      if(err.response && err.response.data && err.response.data.error){
        setError(`회원가입 실패 : ${err.response.data.error}`);
      }else{
        setError('회원가입 실패 : 서버 오류입니다.');
      }
    }
  };
  return (
    <section className='form'>
      <h2 className='form_title'>회원가입</h2>
      <p className='explain'>디자인은 공유될 때 비로소 완성됩니다. 지금 가입하고 당신의 이야기를 들려주세요</p>
      <form className='signin' onSubmit={handleSubmit}>
        <div className='name_box'>
          <p className='name'>
            <label htmlFor="name">이름</label>
            <input id='name' name='name' placeholder='이름을 입력하세요' required onChange={handleChange}/>
          </p>
          <p className='nickname'>
            <label htmlFor="nickname">닉네임</label>
            <input id='nickname' name='nickname' placeholder='닉네임을 입력하세요' required onChange={handleChange}/>
          </p>
        </div>
        <p className='email'>
          <label htmlFor="email">이메일</label>
          <input type='email' id='email' name='email' placeholder='이메일을 입력하세요' required onChange={handleChange}/>
        </p>
        <p className='password'>
          <label htmlFor="password">비밀번호</label>
          <input type='password' id='password' name='password' placeholder='비밀번호를 입력하세요' required style={{marginBottom: '20px'}} onChange={handleChange}/>
          <input type='password' id='password2' name='password2' placeholder='비밀번호 확인' required onChange={handleChange}/>
        </p>
        <p className='agree_box'>
          <input type='checkbox' id='agree' name='agree' required/>
          <label htmlFor="agree">DiGong <span>이용약관</span>에 동의합니다</label>
        </p>
        <p>
          <button type='submit'>회원가입</button>
        </p>

        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </section>
  );
}


export default Signin;