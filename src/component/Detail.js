import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../css/Detail.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faShareNodes, faHeart, faComment } from '@fortawesome/free-solid-svg-icons';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Detail() {
  const { p_id } = useParams();
  const { userId, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  /* 좋아요 */
  const [likedPosts, setLikedPosts] = useState([]);

  /* 댓글아이콘 클릭시 댓글창으로 이동 */
  const commentTextBoxRef = useRef(null);

  const scrollToComment = () => {
    if (commentTextBoxRef.current) {
      commentTextBoxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  /* 공유하기 함수 */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.length > 0 ? data[0].title : '게시물 공유',
          text: data.length > 0 ? data[0].explain : '이 멋진 게시물을 확인해보세요!',
          url: window.location.href,
        });
        console.log('콘텐츠가 성공적으로 공유되었습니다!');
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      alert('공유하기 기능을 지원하지 않는 브라우저입니다. URL이 클립보드에 복사됩니다.');
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => console.log('URL이 클립보드에 복사되었습니다.'))
        .catch((err) => console.error('클립보드 복사 실패:', err));
    }
  };

  useEffect(() => {
    if (userId) {
      axios
        .get(`${API_BASE}/liked-posts/${userId}`)
        .then((res) => {
          const likedIds = res.data.map((post) => post.id);
          setLikedPosts(likedIds);
        })
        .catch((err) => console.error('좋아요 목록 로딩 오류:', err));
    }
  }, [userId]);

  const toggleLike = async (postId) => {
    if (!isLoggedIn) {
      alert('로그인 후 이용가능 합니다.');
      return;
    }

    const liked = likedPosts.includes(Number(postId));
    try {
      if (liked) {
        await axios.delete(`${API_BASE}/like`, { data: { user_id: userId, post_id: postId } });
        setLikedPosts((prev) => prev.filter((id) => id !== Number(postId)));
      } else {
        await axios.post(`${API_BASE}/like`, { user_id: userId, post_id: postId });
        setLikedPosts((prev) => [...prev, Number(postId)]);
      }
    } catch (err) {
      console.error('좋아요 처리 오류:', err);
    }
  };

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ u_id: userId, p_id: p_id, detail_txtbox: '' });
  const [comment, setComment] = useState([]);

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      u_id: userId
    }));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axios.get(`${API_BASE}/detail/${p_id}`)
      .then(res => setData(res.data))
      .catch(err => console.log('조회 오류 : ', err));

    axios.get(`${API_BASE}/comment/${p_id}`)
      .then(res => setComment(res.data))
      .catch(err => console.log('조회 오류 : ', err));
  }, [p_id]);

  const loginClick = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('로그인해야 댓글을 작성할 수 있습니다.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${API_BASE}/comment`, formData);
      alert('코멘트가 등록되었습니다.');
      setFormData(prevFormData => ({ ...prevFormData, detail_txtbox: '' }));
      axios.get(`${API_BASE}/comment/${p_id}`)
        .then(res => setComment(res.data))
        .catch(err => console.log('댓글 로드 오류:', err));
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      alert('오류가 발생되었습니다.');
    }
  };

  useEffect(() => {
    document.body.classList.add('detail-open');
    return () => document.body.classList.remove('detail-open');
  }, []);

  return (
    <>
      <div className="bg_wrap" onClick={() => navigate('/')} />
      <div className="detail_con_wrap">
        <div className="detail_nav_wrap">
          <div className="detail_close_btn_wrap" onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faXmark} className="detail_close_btn" />
          </div>
          <div className="detail_nav">
            <ul>
              <li>
                {data.length > 0 ? (
                  <>
                    {userId === data[0].author_id ? (
                      <Link to="/profile"><img src={`${API_BASE}/uploads/${data[0].img}`} alt="프로필사진" /></Link>
                    ) : (
                      <Link to={`/UserInfo/${data[0].author_id}`}><img src={`${API_BASE}/uploads/${data[0].img}`} alt="프로필사진" /></Link>
                    )}
                    <p className="detail_nav_txtclr"><Link to="/profile">프로필</Link></p>
                  </>
                ) : (
                  <p>로딩 중...</p>
                )}
              </li>
              <li className="detail_nav_bg" onClick={handleShare}>
                <FontAwesomeIcon icon={faShareNodes} className="detail_nav_icon" />
                <p className="detail_nav_txtclr">공유</p>
              </li>
              <li className="detail_nav_bg" onClick={scrollToComment}>
                <FontAwesomeIcon icon={faComment} className="detail_nav_icon" />
                <p className="detail_nav_txtclr"><Link to="">댓글</Link></p>
              </li>
              <li className="detail_nav_bg">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="detail_nav_icon"
                  style={{ color: likedPosts.includes(Number(p_id)) ? 'red' : '#333', cursor: 'pointer' }}
                  onClick={() => toggleLike(p_id)}
                />
                <p className="detail_nav_txtclr">좋아요</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="detail_con">
          <div className="detail_titlebox">
            {data.length > 0 ? (
              <>
                <img src={`${API_BASE}/uploads/${data[0].img}`} alt="상세보기 글 프로필 사진" />
                <div className="titlebox_txt">
                  <h2>{data[0].title}</h2>
                  <p>
                    {data[0].explain.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </>
            ) : (
              <p>로딩 중...</p>
            )}
          </div>

          <div className="detail_photo">
            {data.map((item, index) => (
              <p key={index}><img src={`${API_BASE}/uploads/${item.file_name}`} alt={`상세보기 이미지${index}`} /></p>
            ))}
          </div>

          <div className="detail_comment">
            <div className="detail_comment_title">
              <img src={`${process.env.PUBLIC_URL}/images/comment.png`} alt="댓글 아이콘" />
              <span>댓글</span>
            </div>
            {!isLoggedIn ? (
              <>
                <p>
                  <textarea
                    ref={commentTextBoxRef}
                    name="detail_txtbox"
                    id="detail_txtbox"
                    className="detail_txtbox txtbox_disabled"
                    rows="5"
                    placeholder="댓글을 입력하기 위해선 로그인을 해야 합니다."
                    onClick={loginClick}
                  />
                </p>
                <p className="detail_comment_btn_wrap">
                  <button type="button" className="detail_comment_btn" onClick={loginClick}>
                    입력
                  </button>
                </p>
              </>
            ) : (
              <>
                <form onSubmit={handleSubmit}>
                  <p>
                    <textarea
                      ref={commentTextBoxRef}
                      name="detail_txtbox"
                      id="detail_txtbox"
                      className="detail_txtbox"
                      rows="5"
                      onChange={handleChange}
                      value={formData.detail_txtbox}
                    />
                  </p>
                  <p className="detail_comment_btn_wrap">
                    <button type="submit" className="detail_comment_btn">
                      입력
                    </button>
                  </p>
                </form>
              </>
            )}
          </div>

          <div className="detail_reading_comment_wrap">
            <div className="detail_reading_comment">
              {comment.map((item, index) => (
                <div className="detail_reading_comment_profile" key={index}>
                  <img src={`${API_BASE}/uploads/${item.img}`} alt="댓글 프로필 사진" />
                  <div className="detail_reading_comment_profile_txt">
                    <p>{item.nickname}</p>
                    <p>
                      {item.comment.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Detail;