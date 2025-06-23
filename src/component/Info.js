import React , {useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Info() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const { userId, userNickname, userEmail, userProfileImg, userIntroduce, updateProfileImg } = useAuth();

    const handleImageChange = async (event) => {
        const file = event.target.files[0];

        if (!file || !file.type.startsWith('image/')) return;

        if (!userId) {
            alert("로그인 후 프로필 이미지를 변경할 수 있습니다.");
            return;
        }

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('image', file);

        try {
            const response = await axios.post(`${API_BASE}/upload-profile-img`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imagePath = response.data.path;
            updateProfileImg(imagePath);
            alert("프로필 이미지가 성공적으로 업데이트되었습니다.");
        } catch (err) {
            console.error('이미지 업로드 실패:', err.response ? err.response.data : err.message);
            alert('이미지 업로드에 실패했습니다.');
        }
    };

    const handleEditClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className='user_profile'>
            <div className='user_pic'> 
                <img src={`${API_BASE}/uploads/${userProfileImg}`} alt="프로필사진" />
                {userId && (
                    <button onClick={handleEditClick}>
                        🔧
                    </button>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} />
            </div>
            <div className='user_info'>
                <p className='user_n'>{userNickname}</p>
                <p className='user_e'>{userEmail}</p>
                <p className='user_introT'>자기소개</p>
                <p className='user_introP'>{userIntroduce}</p>
                <br />
                {userId && (
                    <button onClick={() => navigate(`/profileupdate/${userId}`)}>수정하기</button>
                )}
            </div>
        </div>
    );
}

export default Info;