import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function ProfileUpdate() {
    const { id } = useParams();
    console.log("Profile페이지에서 받은 id:", id);
    const navigate = useNavigate();
    const location = useLocation();
    const { nickname, email, introduce } = location.state || {};;

    const [users, setUsers] = useState({
        email: '',
        name: '',
        nickname: '',
        introduce: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
    if (id) {
        axios.get(`${API_BASE}/profileupdate/${id}`)
            .then(res => setUsers(res.data))
            .catch(err => {
                console.error(err);
                setError('유저 정보를 불러오는 중 오류가 발생했습니다.');
            });
        }
    }, [id]);

    const handleChange = (e) => {
        setUsers({ ...users, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${API_BASE}/profileupdate/${id}`, {
                name: users.name,
                nickname: users.nickname,
                introduce: users.introduce
            });
            alert('프로필이 성공적으로 수정되었습니다.');
            navigate(-1); // 수정 후 프로필 페이지로 이동
            } catch (err) {
            console.error('axios 에러:', err.response || err.message);
            setError('프로필 수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <section className='form'>
        <h2 className='form_title'>유저 정보 수정</h2>
        <p className='explain'>당신을 더 잘 표현할 수 있도록 프로필을 업데이트해보세요.</p>
        <form className='user_update' onSubmit={handleSubmit}>
            <div className='name_box'>
                <p className='name'>
                    <label htmlFor="name">이름</label>
                    <input
                    id='name'
                    name='name'
                    placeholder='이름을 입력하세요'
                    required
                    onChange={handleChange}
                    value={users.name}
                    />
                </p>
                <p className='nickname'>
                    <label htmlFor="nickname">닉네임</label>
                    <input
                    id='nickname'
                    name='nickname'
                    placeholder='닉네임을 입력하세요'
                    required
                    onChange={handleChange}
                    value={users.nickname}
                    />
                </p>
            </div>
            <p className='email'>
            <label htmlFor="email">이메일</label>
            <input
                type='email'
                id='email'
                name='email'
                placeholder='이메일을 입력하세요'
                value={users.email}
                readOnly
            />
            </p>
            <p className='user_intro'>
            <label htmlFor="introduce">자기소개</label>
            <textarea
                name="introduce"
                id="introduce"
                cols={62}
                rows={10}
                placeholder='자기소개를 입력하세요'
                value={users.introduce}
                onChange={handleChange}
            />
            </p>
            <p>
            <button type='submit'>정보 수정 완료</button>
            </p>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        </section>
    );
}

export default ProfileUpdate;
