import React , {useRef} from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function User_Info(props) {
    const fileInputRef = useRef(null);
    const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (!file || !file.type.startsWith('image/')) return;

    const formData = new FormData();
    formData.append('userId', props.userId);
    formData.append('image', file);

    try {
        const response = await axios.post(`${API_BASE}/upload-profile-img`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const imagePath = response.data.path;
        props.setUserImg(imagePath);
    } catch (err) {
        console.error('이미지 업로드 실패:', err);
        alert('이미지 업로드에 실패했습니다.');
    }
    };

    const handleEditClick = () => {
      fileInputRef.current.click();
    };
    return (
        <div className='user_profile'>
          <div className='user_pic'> 
            <img src={`${API_BASE}/uploads/${props.userImg}`} alt="프로필사진" />
            <button onClick={handleEditClick} >
            🔧
            </button>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} />
            </div>
            <div className='user_info'>
                <p className='user_n'>{props.nickname}</p>
                <p className='user_e'>{props.email}</p>
                <p className='user_intro'>자기소개</p>
                <p className='user_introP'></p>
            </div>
        </div>
    );
}

export default User_Info;