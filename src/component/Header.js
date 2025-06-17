import React, {useEffect, useState, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Header(props) {
  const { setSelectedCategory, nickname, userImg, search, setSearch } = props;
  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const profileRef = useRef(null);
  const m_profileRef = useRef(null);

  /* 스크롤 시 헤더 그림자 */
  const [scrolled, setScrolled] = useState(false);

  const categories = ['All', 'Photo', 'Portfolio', 'Graphic', 'Illust', 'Typography'];

  const cateOnClick = (category) => {
    setSelectedCategory(category);
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* 스크롤 이벤트 */
  useEffect(()=>{
    const handleScroll = () =>{
      if(window.scrollY > 0) {
        setScrolled(true);
      }else{
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setMenu(!isOpen);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleProfile = () => {
    setProfile(!profile);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profile && profileRef.current && !profileRef.current.contains(e.target) && m_profileRef.current && !m_profileRef.current.contains(e.target)) {
        setProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profile]);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className='h_wrap'>
        <div className={`toggle ${isOpen ? 'open' : ''}`} onClick={handleToggle}>
          <span className='t1'></span>
          <span className='t2'></span>
          <span className='t3'></span>
        </div>
        <h1><Link to='/'>
          <img
            src={isMobile ?`${process.env.PUBLIC_URL}/images/logo_m.png`:`${process.env.PUBLIC_URL}/images/logo.png`}
            alt="Logo"
          />
        </Link></h1>
        <div className='h_search'>
          <input type="text" name='search' id='search' placeholder='검색을 통해 디공에서 아이디어를 나눠요!' style={{fontWeight:'lighter'}} value={search} onChange={(e) => setSearch(e.target.value)} />
          <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
        </div>
        {!nickname ? (
          <ul className='main_header'>
            <li><Link to='/login'>로그인</Link></li>
            <li><Link to='/signin'>회원가입</Link></li>
          </ul>
        ) : (
          <ul className='main_header'>
            <li onClick={handleProfile} ref={profileRef}><img src={`${API_BASE}/uploads/${userImg}`} alt="Profile" />{nickname}
            {profile && (<div className="h_profile">
                <ul>
                  <li><Link to='profile'>내 프로필</Link></li>
                  <li><Link to='upload'>작품등록</Link></li>
                  <li onClick={handleLogout}>로그아웃</li>
                </ul>
              </div>)}
            </li>
          </ul>
        )}


        <ul className='mobile'>
          <li>
            <div className='m_search'>
              <input type="text" name='search' id='search' className={showMobileSearch ? 'active':''} style={{maxHeight: showMobileSearch ? '40px' : '0', opacity: showMobileSearch ? 1 : 0, transition: 'max-height 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.4s', overflow: 'hidden', display: 'block'}}/>
              <FontAwesomeIcon icon={faMagnifyingGlass}  className='s_icon' onClick={() => setShowMobileSearch(!showMobileSearch)}/>
            </div>
          </li>
          {!nickname ? (
          <li><Link to='/login'><FontAwesomeIcon icon={faUser} /></Link></li>
          ) : (
          <li onClick={handleProfile} ref={m_profileRef}><img src={`${API_BASE}/uploads/${userImg}`} alt="User Profile" />
            {profile && (<div className="h_profile">
                <ul>
                  <li><Link to='profile'>내 프로필</Link></li>
                  <li><Link to='upload'>작품등록</Link></li>
                  <li onClick={handleLogout}>로그아웃</li>
                </ul>
              </div>)}
            </li>
          )}
        </ul>
      </div>
      <nav style={{left:menu?'0%':'-100%'}} onClick={() => {setMenu(false); setIsOpen(false);}}>
        <div>
          <ul>
            {categories.map((category) => (
              <li key={category} onClick={() => cateOnClick(category)}>
                {category}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;