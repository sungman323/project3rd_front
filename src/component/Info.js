import React , {useState, useRef} from 'react';
import axios from 'axios';

function User_Info(props) {
    const [profileImage, setProfileImage] = useState(()=>props.userImg);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (!file || !file.type.startsWith('image/')) return;

    const formData = new FormData();
    formData.append('userId', props.userId);
    formData.append('image', file);

    try {
        setUploading(true);

        const response = await axios.post('http://localhost:9070/upload-profile-img', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const imagePath = response.data.path;
        setProfileImage(imagePath);
        props.setUserImg(imagePath);
    } catch (err) {
        console.error('이미지 업로드 실패:', err);
        alert('이미지 업로드에 실패했습니다.');
    } finally {
        setUploading(false);
    }
    };

    const handleEditClick = () => {
      fileInputRef.current.click();
    };
    return (
        <div className='user_profile'>
          <div className='user_pic'> 
            <img src={`http://localhost:9070/uploads/${props.userImg}`}/>
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