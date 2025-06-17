import React, {useEffect, useState, useRef} from 'react';
import { Link, useLocation } from 'react-router-dom';
import Info from './Info';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import '../css/profile.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Profile(props) {
    const location = useLocation();
    const tabs = [{ title: '작품' }, { title: '좋아요' }];
    const [posts, setPosts] = useState([]);
    const [tabmenu, setTabmenu] = useState(tabs[0].title);
    const [openMenuPostId, setOpenMenuPostId] = useState(null);

    /* 좋아요 */
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(()=> {
        if (tabmenu === '좋아요' && props.userId){
            axios.get(`${API_BASE}/liked-posts/${props.userId}`)
                .then(res => setLikedPosts(res.data));
        }
    }, [tabmenu, props.userId]);

    useEffect(() => {
        if (props.userId) {
        axios.get(`${API_BASE}/user-posts?author_id=${props.userId}`)
            .then(res => {
                setPosts(res.data);
                // console.log('API 응답 데이터:', res.data);
        })
            .catch(err => console.error(err));
        }
    }, [props.userId]);

    const PostItem = ({ post }) => {
        const buttonRef = useRef(null);
        const editRef = useRef(null);

        const isMenuVisible = openMenuPostId === post.id;

        const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // 현재 열린 메뉴가 이 포스트면 닫기, 아니면 열기
        if (isMenuVisible) {
            setOpenMenuPostId(null);
        } else {
            setOpenMenuPostId(post.id);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (editRef.current && !editRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) {
            setOpenMenuPostId(null);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuVisible]);


    const handleDelete = (id) => {
        const confirmed = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
        if (!confirmed) return;

        axios.delete(`${API_BASE}/profile/${id}`)
            .then((res) => {
                alert(res.data.message);
                window.location.reload();
            })
            .catch((err) => {
                console.error('삭제 실패:', err);
                alert('삭제 중 오류가 발생했습니다.');
            });
    };

    return (
        <div className="post-card">
            <Link to={`/detail/${post.id}`} state={{ backgroundLocation: location }}>
                <img src={`${API_BASE}/uploads/${post.file_name}`} alt={post.title} />
            <div className='g_cover'>
            <button ref={buttonRef} onClick={handleButtonClick}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
            <img src={`${API_BASE}/uploads/${post.img}`} alt="profile" />
            <p>{post.title}</p>
            </div>            
            </Link>
            {isMenuVisible && (
            <div className={`edit_menu ${isMenuVisible ? 'show':''}`} ref={editRef}>
                <ul>
                    <li>
                        {/* {console.log("수정하기로 넘길 post_id:", post.id)} */}
                        <Link to={`/edit/${post.id}`} onClick={() => setOpenMenuPostId(null)}>수정하기</Link></li>
                    <li onClick={() => handleDelete(post.id)}>삭제하기</li>
                </ul>
            </div>
            )}
        </div>
        );
    };


    return (
        <section className='profile'>
            <div className='bg'>
                <img src={`${process.env.PUBLIC_URL}/images/samples/profile_bg.png`} alt="bg" />
            </div>
            <article className='showcase'>
                <Info nickname={props.nickname} email={props.email} userImg={props.userImg} userId={props.userId} setUserImg={props.setUserImg} />
                <div className='works'>
                    <ul className='inner_showcase'>
                        {tabs.map((tab) => (
                            <li className={tabmenu === tab.title ? 'act' : ''} key={tab.title} onClick={() => setTabmenu(tab.title)}>
                                {tab.title}
                            </li>
                        ))}
                    </ul>
                    <div className='tab_content'>
                        {tabmenu === '작품' ? (
                            posts.length > 0 ? (
                                <div className="post-list">
                                    {posts.map(post => {
                                        return <PostItem key={`${post.id}-${post.title}`} post={post} />;
                                    })}
                                </div>
                            ) : (
                                <p>등록된 작품이 없습니다.</p>
                            )
                        ) : null}
                        
                        {tabmenu === '좋아요' ? (
                            likedPosts.length > 0 ? (
                                <div className='post-list'>
                                    {likedPosts.map(post => (
                                    <div className="post-card" key={post.id}>
                                        <Link to={`/detail/${post.id}`} state={{ backgroundLocation: location }}>
                                        <img src={`${API_BASE}/uploads/${post.file_name}`} alt={post.title} />
                                        <div className='g_cover'>
                                            <img src={`${API_BASE}/uploads/${post.img}`} alt="profile" />
                                            <p>{post.title}</p>
                                        </div>
                                        </Link>
                                    </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{textIndent:'30px', marginTop:'30px'}}>좋아요 한 작품이 없습니다.</p>
                            )
                        ) : null}
                    </div>
                </div>
            </article>
        </section>
    );
}

export default Profile;
