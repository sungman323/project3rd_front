import React, {useEffect, useState, useRef} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../css/Detail.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faShareNodes, faHeart, faComment, faArrowUp } from '@fortawesome/free-solid-svg-icons';

function Detail(props) {
  const {p_id} = useParams();

  /* 좋아요 */
  const userId = props.userId;
  const [likedPosts, setLikedPosts] = useState([]);

  /* 댓글아이콘 클릭시 댓글창으로 이동 */
  const commentTextBoxRef = useRef(null);

  const scrollToComment = () =>{
    if(commentTextBoxRef.current){
      commentTextBoxRef.current.scrollIntoView({
        behavior: 'smooth',
        block:'center'
      });
    }
  };

  /* 공유하기 함수 */
const handleShare = async () => {
  if (navigator.share) { // 
    try {
      await navigator.share({
        title: data.length > 0 ? data[0].title : '게시물 공유',
        text: data.length > 0 ? data[0].explain : '이 멋진 게시물을 확인해보세요!', 
        url: window.location.href
      });
      console.log('콘텐츠가 성공적으로 공유되었습니다!');
    } catch (error) {
      console.error('공유 실패:', error);
    }
  } else {
    alert('공유하기 기능을 지원하지 않는 브라우저입니다. URL이 클립보드에 복사됩니다.');
    navigator.clipboard.writeText(window.location.href)
      .then(() => console.log('URL이 클립보드에 복사되었습니다.'))
      .catch(err => console.error('클립보드 복사 실패:', err));
  }
};

  useEffect(()=>{
    if(userId){
      axios.get(`http://localhost:9070/liked-posts/${userId}`)
        .then(res=>{
          const likedIds = res.data.map(post => post.id);
          setLikedPosts(likedIds);
        })
        .catch(err => console.error('좋아요 목록 로딩 오류:', err));
    }
  }, [userId]);

  const toggleLike = async (postId) => {
    if (!userId) return alert('로그인 후 이용가능 합니다.');

    const liked = likedPosts.includes(Number(postId));
    try{
      if (liked){
        await axios.delete('http://localhost:9070/like',{data: {user_id: userId, post_id: postId}});
        setLikedPosts(prev => prev.filter(id => id !== Number(postId)));
      }else{
        await axios.post('http://localhost:9070/like', {user_id: userId, post_id: postId});
        setLikedPosts(prev => [...prev, Number(postId)]);
      }
    }catch(err){
      console.error('좋아요 처리 오류:', err);
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({u_id: props.userId, p_id: p_id, detail_txtbox:''});

  const [comment, setComment] = useState([]);

  const handleChange = (e) => {
    setFormData({...formData, u_id: props.userId, [e.target.name]:e.target.value});
    // console.log(formData);
  }

/*   const scrollToTop = () => {
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
  }; */

useEffect(() => {
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
};

window.addEventListener('scroll', toggleVisibility);
return () => window.removeEventListener('scroll', toggleVisibility);
}, []);

  useEffect(() => {
    axios.get(`http://localhost:9070/detail/${p_id}`)
    .then(res=>{
      setData(res.data);
    })
    .catch(err => console.log('조회 오류 : ', err));

    axios.get(`http://localhost:9070/comment/${p_id}`)
    .then(res=>{
      setComment(res.data);
    })
    .catch(err => console.log('조회 오류 : ', err));
  }, [p_id]);

  const loginClick = () => {
    navigate('/login');
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{ // 데이터 전송 성공 시
      await axios.post('http://localhost:9070/comment', formData);
      alert('코멘트가 등록되었습니다.');
      window.location.href = '/detail/'+p_id;
    }
    catch{ // 데이터 전송 실패 시
      alert('오류가 발생되었습니다.')
    }
  }

  /* 상세보기 모바일에서 메인컨텐츠 안보이게하기 */
  useEffect(() => {
    document.body.classList.add('detail-open');
    return () => document.body.classList.remove('detail-open');
  }, []);

  
return (
<>
    {/* 배경 */}
    <div className="bg_wrap" onClick={()=>navigate(-1)}></div>
    {/* 상세보기 본 컨텐츠 */}
    <div className="detail_con_wrap">
        {/* 상세보기 네비게이션 */}
        <div className="detail_nav_wrap">
        <div className="detail_close_btn_wrap" onClick={()=>navigate(-1)}>
                <FontAwesomeIcon icon={faXmark} className='detail_close_btn' />
            </div>
            <div className="detail_nav">
              <ul>
                  <li>
                  {data.length > 0 ? (
                    <>
                    {console.log(data)}
                      {props.userId==data[0].author_id?(<Link to="/profile"><img src={`http://localhost:9070/uploads/${data[0].img}`} alt="프로필사진" /></Link>):(<Link to={`/UserInfo/${data[0].author_id}`}><img src={`http://localhost:9070/uploads/${data[0].img}`} alt="프로필사진" /></Link>)}
                      <p className='detail_nav_txtclr'><Link to="/profile">프로필</Link></p>
                    </>
                    ) : (
                      <p>로딩 중...</p>  // 데이터가 로딩되지 않았을 때 표시할 내용
                  )}
                  </li>
                  <li className='detail_nav_bg' onClick={handleShare}>
                      <FontAwesomeIcon icon={faShareNodes} className='detail_nav_icon' />
                      <p className='detail_nav_txtclr'>공유</p>
                  </li>
                  <li className='detail_nav_bg' onClick={scrollToComment}>
                      <FontAwesomeIcon icon={faComment} className='detail_nav_icon' />
                      <p className='detail_nav_txtclr'><Link to=''>댓글</Link></p>
                  </li>
                  <li className='detail_nav_bg'>
                      <FontAwesomeIcon
                      icon={faHeart}
                      className='detail_nav_icon'
                      style={{color:likedPosts.includes(Number(p_id)) ? 'red' : '#333', cursor:'pointer'}}
                      onClick={() => toggleLike(p_id)}
                      />
                      <p className='detail_nav_txtclr'>좋아요</p>
                  </li>
              </ul>
            </div>
        </div>
        <div className="detail_con">
            {/* 상세보기 상단 */}
            <div className="detail_titlebox">
                {data.length > 0 ? (
                  <>
                <img src={`http://localhost:9070/uploads/${data[0].img}`} alt="상세보기 글 프로필 사진" />
                <div className="titlebox_txt">
                    <h2>{data[0].title}</h2>
                    <p>{data[0].explain.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}</p>
                </div>
                  </>
                ) : (
                  <p>로딩 중...</p>  // 데이터가 로딩되지 않았을 때 표시할 내용
                )}
            </div>

            {/* 컨텐츠 이미지 */}
            <div className="detail_photo">
              {data.map((item, index) => (
                <p key={index}><img src={`http://localhost:9070/uploads/${item.file_name}`} alt={`상세보기 이미지${index}`} /></p>
              ))}
            </div>

            {/* 댓글작성 */}
            <div className="detail_comment">
                <div className="detail_comment_title">
                    <img src={`${process.env.PUBLIC_URL}/images/comment.png`} alt="댓글 아이콘" />
                    <span>댓글</span>
                </div>
                {!props.nickname ? (
                  <>
                    <p>
                      <textarea ref={commentTextBoxRef} name="detail_txtbox" id="detail_txtbox" className='detail_txtbox txtbox_disabled' rows='5' placeholder='댓글을 입력하기 위해선 로그인을 해야 합니다.' onClick={loginClick}></textarea>
                    </p>
                    <p className='detail_comment_btn_wrap'>
                      <button type="button" className="detail_comment_btn" onClick={loginClick}>입력</button>
                    </p>
                  </>
                  ) : (
                    <>
                    <form onSubmit={handleSubmit}>
                      <p>
                        <textarea ref={commentTextBoxRef} name="detail_txtbox" id="detail_txtbox" className='detail_txtbox' rows='5' onChange={handleChange} value={formData.detail_txtbox}></textarea>
                      </p>
                      <p className='detail_comment_btn_wrap'>
                        <button type="submit" className="detail_comment_btn">입력</button>
                      </p>
                    </form>
                    </>
                  )}
                
            </div>

            {/* 댓글 */}
            <div className="detail_reading_comment_wrap">
                <div className="detail_reading_comment">
                  {comment.map((item, index) => (
                    <div className="detail_reading_comment_profile" key={index}>
                        <img src={`http://localhost:9070/uploads/${item.img}`} alt="댓글 프로필 사진" />
                        <div className="detail_reading_comment_profile_txt">
                          <p>{item.nickname}</p>
                          <p>{item.comment.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                            {line}
                            <br />
                            </React.Fragment>
                          ))}</p>
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