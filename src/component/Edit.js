import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Edit() {
    const { id } = useParams();
    console.log("Edit 페이지에서 받은 id:", id);

    const [post, setPost] = useState({
        title: '',
        category: '',
        explain: '',
        file: ''
    });
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 기존 게시물 데이터 불러오기
    useEffect(() => {
    axios.get(`${API_BASE}/profile/${id}`)
        .then(res => {
        setPost(res.data);
        setLoading(false);

        // 기존 이미지 미리보기 등록
        if (res.data.file_name) {
            setPreviews([
            {
                name: res.data.file_name,
                url: `${API_BASE}/uploads/${res.data.file_name}`,
            },
            ]);
        }
        })
        .catch(err => {
        console.error(err);
        setLoading(false);
        });
    }, [id]);


    // 새로운 파일 선택 시 미리보기 처리
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

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
            setPreviews(previewResults); // 기존 미리보기를 새 것으로 교체
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('category', post.category);
        formData.append('explain', post.explain);

        if (files.length > 0) {
            files.forEach(file => {
            formData.append('files', file); // 이름 반드시 'files'로 맞출 것
            });
        }

        axios.post(`${API_BASE}/update-post/${id}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                console.log('서버 응답:', res.data);
                alert('수정이 완료되었습니다!');
                navigate(-1);
            })
            .catch(err => {
                console.error('수정 중 오류 발생:', err.response?.data || err.message);
                alert('수정 실패');
            });
    };



    return (
        <section className='form'>
            <h2 className='form_title'>작품수정</h2>
            <form className='upload' onSubmit={handleSubmit}>
                <p className='title'>
                <label htmlFor="title">제목</label>
                <input
                    id='title'
                    name='title'
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                    required
                />
                </p>

                <p className='category'>
                <label htmlFor="category">카테고리</label>
                <select
                    name="category"
                    id="category"
                    value={post.category}
                    onChange={(e) => setPost({ ...post, category: e.target.value })}
                >
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
                <input
                type='file'
                name='files'
                multiple accept='image/*'
                id='addfiles'
                onChange={handleFileChange}
                />
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
                <textarea
                    name="explain"
                    id="explain"
                    placeholder='간단한 설명을 입력하세요.'
                    rows={10}
                    value={post.explain}
                    onChange={(e) => setPost({ ...post, explain: e.target.value })}
                />
                </p>

                <p>
                <button type='submit'>작품수정</button>
                </p>
            </form>
            </section>
        );
    }

export default Edit;
