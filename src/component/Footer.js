import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faSquareFacebook, faSquareYoutube, faSquareXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

function Footer(props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [visibleUp, setVisibleUp] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setVisibleUp(window.scrollY > 200); // 스크롤 위치가 200px 이상일 때 visible을 true로 설정
    };
    window.addEventListener('scroll', handleScroll); // 스크롤 이벤트 리스너 추가
    return () => {
      window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, [])

  return (
    <footer>
      {visibleUp &&(<button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><FontAwesomeIcon icon={faArrowUp} /></button>)}
      <h2><Link to='/'>
          <img
            src={isMobile ?`${process.env.PUBLIC_URL}/images/logo_m.png`:`${process.env.PUBLIC_URL}/images/logo.png`}
            alt="로고"
          /></Link></h2>
      <address>Copyright&copy;2025 DIGONG All Rights Reserved.</address>
      <ul>
        <li><FontAwesomeIcon icon={faInstagram} /></li>
        <li><FontAwesomeIcon icon={faSquareFacebook} /></li>
        <li><FontAwesomeIcon icon={faSquareYoutube} /></li>
        <li><FontAwesomeIcon icon={faSquareXTwitter} /></li>
      </ul>
    </footer>
  );
}

export default Footer;