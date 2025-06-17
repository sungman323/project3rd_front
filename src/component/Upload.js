import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/form.css';

function Upload(props) {
  const [formData, setFormData] = useState({title:'',category:'',explain:'',author_id:props.userId});
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]:e.target.value});
    console.log(formData);
  }
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // 미리보기 생성
    const newPreviews = selectedFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ name: file.name, url: reader.result });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviews).then((previewResults) => {
      setPreviews(previewResults);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(); // 새 FormData 객체 생성
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('explain', formData.explain);
    data.append('author_id', formData.author_id);

    files.forEach(file => {
      data.append('files', file);
    });

    fetch('http://localhost:9070/upload', {
      method: 'POST',
      body: data,
    })
    .then(res => res.json())
    .then(data => {
      console.log('업로드 성공 : ', data);
      alert('등록이 완료 됐습니다.');
      navigate('/');
      navigate(`/detail/${data.postId}`, {
        state: { backgroundLocation: location }
      });
    })
    .catch(err => {
      console.error('업로드 실패', err);
    });
  };

  return (
    <section className='form'>
      <h2 className='form_title'>작품등록</h2>
      <p className='explain'>당신의 감각은 작품이 말해줄 시간만 기다리고 있습니다. 지금 세상과 공유하세요.</p>
      <form className='upload' onSubmit={handleSubmit}>
        <p className='title'>
          <label htmlFor="title">제목</label>
          <input id='title' name='title' value={formData.title} onChange={handleChange} placeholder='제목을 입력하세요' required/>
        </p>
        <p className='category'>
          <label htmlFor="category">카테고리</label>
          <select name="category" id="category" value={formData.category} onChange={handleChange}>
            <option value="">카테고리 선택</option>
            <option value="Photo">Photo</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Graphic">Graphic</option>
            <option value="Illust">Illust</option>
            <option value="Typography">Typography</option>
          </select>
        </p>
        <div className='addfiles'>
          <label htmlFor="addfiles">파일첨부</label>
          <input type='file' multiple accept='image/*' onChange={handleFileChange} id='addfiles' name='addfiles' required />
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
        {previews.map((file, index) => (
          <div key={index} style={{ marginRight: '10px' }}>
            <img
              src={file.url}
              alt={file.name}
              style={{ width: '450px', height: 'auto', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
        </div>
        <p>
          <label htmlFor="explain">설명</label>
          <textarea name="explain" id="explain" value={formData.explain} onChange={handleChange} placeholder='간단한 설명을 입력하세요.' rows={10} />
        </p>
        <p>
          <button type='submit'>작품등록</button>
        </p>        
      </form>
    </section>
  );
}

export default Upload;