// Main.js
import React, { useCallback, useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import LazyImage from './LazyImage';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import '../css/Main.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Main(props) {
  const { selectedCategory, setSelectedCategory, userId, search, setSearch } = props;
  /* 좋아요 */
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(()=>{
    if (userId){
      axios.get(`${API_BASE}/liked-posts/${userId}`)
        .then(res=> setLikedPosts(res.data.map(p=>p.id)));
    }
  }, [userId]);

  const toggleLike = async (e, postId) => {
    e.preventDefault();
    if(!userId) return alert("로그인 후 이용 가능합니다.");
    const liked = likedPosts.includes(postId);
    try{
      if(liked){
        await axios.delete(`${API_BASE}/like`,{data:{user_id:userId, post_id:postId}});
        setLikedPosts(prev => prev.filter(id => id !== postId));
      }else{
        await axios.post(`${API_BASE}/like`, {user_id:userId, post_id:postId});
        setLikedPosts(prev => [...prev,postId]);
      }
    }catch(err){
      console.error("좋아요 처리 오류", err);
    }
  };
  
  const location = useLocation(); 

  const [data, setData] = useState([]);

  const categories = ['All', 'Photo', 'Portfolio', 'Graphic', 'Illust', 'Typography'];

  /* 상세보기 모바일에서 메인 숨기기 */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDetailPage = location.pathname.startsWith('/detail');
  const shouldHide = isDetailPage && isMobile;

  const loadData = useCallback(() => {
    axios.get(`${API_BASE}/posts`)
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.log(err));
  }, []);
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  const breakpointColumnsObj = {
    default: 6,
    1024: 4,
    768: 3,
    600: 2,
    400: 1,
  };

  const leftImages = [
    '/images/samples/sample01.jpg',
    '/images/samples/sample18.jpg',
    '/images/samples/sample34.jpg'
  ];

  const rightImages = [
    '/images/samples/sample33.jpg',
    '/images/samples/works7.png',
    '/images/samples/works3.png',
    '/images/samples/sample05.jpg'
  ];

  const [leftVisibles, setLeftVisibles] = useState([]);
  const [rightVisibles, setRightVisibles] = useState([]);
  const [sAreaVisibles, setSAreaVisibles] = useState([]);
  const [h2Visible, setH2Visible] = useState(false);
  

  useEffect(() => {
    leftImages.forEach((_, index) => {
      setTimeout(() => {
        setLeftVisibles(prev => [...prev, index]);
      }, index * 400);
    });
  }, []);

  useEffect(() => {
    rightImages.forEach((_, index) => {
      setTimeout(() => {
        setRightVisibles(prev => [...prev, index]);
      }, index * 400);
    });
  }, []);

  useEffect(()=> {
    setTimeout(()=> {
      setH2Visible(true);
      [0,1].forEach((_,index)=> {
        setTimeout(()=> {
          setSAreaVisibles(prev => [...prev, index]);
        }, (index+1) * 400);
        });
    }, 200);
  }, []);

  const cateOnClick = (category) => {
    setSelectedCategory(category); 
  }

  const filteredData = data.filter(item => {
    const matchCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
  
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.explain?.toLowerCase().includes(search.toLowerCase());
  
    return matchCategory && matchSearch;
  });

  return (
    <main>
      {!shouldHide &&(
      <div className='m_area'>
        <h2 className={h2Visible ? 'visible':''}>디&#x2D0;공(共)</h2>
        <div className='s_area'>
          <p className={sAreaVisibles.includes(0) ? 'visible':''}><span>디자인</span>으로 말하고,</p>
          <p className={sAreaVisibles.includes(1) ? 'visible':''}><span>공유</span>로 이어지다.</p>
        </div>
        <div className='wrapper'>
          <div className='l_img'>
            {leftImages.map((src, index) => (
              <img  key={index} src={src} alt={`Left ${index}`} className={`images ${leftVisibles.includes(index) ? 'visible':''}`}/>
            ))}
          </div>
          <div className='r_img'>
            {rightImages.map((src, index) => (
              <img  key={index} src={src} alt={`Right ${index}`} className={`images ${rightVisibles.includes(index) ? 'visible':''}`}/>
            ))}
          </div>
        </div>
      </div>
      )}
      <div className='c_area'>
        <div className='c_wrap'>
          {categories.map((category) => (
            <div
              key={category}
              className={`category-item ${selectedCategory === category ? 'c_act cate' : 'cate'}`}

              onClick={() => cateOnClick(category)}
            >
              {category === 'All' ? (<></>):(<img src={`${process.env.PUBLIC_URL}/images/icon_${String(category).toLowerCase()}.svg`} alt={category} />)}
              <p>{category}</p>
            </div>
          ))}
        </div>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="g_area"
        columnClassName="g_column"
      >
        {filteredData.map((item, index) => (
          <Link to={`/detail/${item.id}`} key={index} state={{ backgroundLocation: location }}>
            <div className='gallery'>
              <LazyImage src={`${API_BASE}/uploads/${item.file_name}`} alt={`${item.title}`}></LazyImage>
              <div className='g_cover'>
                <button onClick={(e) => toggleLike(e, item.id)}>
                  <FontAwesomeIcon icon={faHeart} style={{color: likedPosts.includes(item.id) ? 'red' : '#fff'}} />
                </button>
                <img src={`${API_BASE}/uploads/${item.img}`} alt="profile" /><p>{item.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </Masonry>
    </main>
  );
}

export default Main;