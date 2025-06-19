import React, {useEffect, useState, useRef} from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Info from './Info';
import axios from 'axios';
import '../css/profile.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function UserInfo(props) {
    const { id:userId } = useParams();
    const location = useLocation();
    const tabs = [{ title: '작품' }];
    const [posts, setPosts] = useState([]);
    const [tabmenu, setTabmenu] = useState(tabs[0].title);

    //배경 랜덤
    const [background, setBackground] = useState(null);
    const backgroundImages = [
        {id: 1, video: "/images/user_bg1.mp4"},
        {id: 2, video: "/images/user_bg2.mp4"},
        {id: 3, video: "/images/user_bg3.mp4"},
        {id: 4, video: "/images/user_bg4.mp4"}
    ];

    useEffect(()=> {
        const randomIndex = Math.floor(Math.random() * backgroundImages.length);
        setBackground(backgroundImages[randomIndex]);
    },[]);

    /* 좋아요 */
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {
        if (userId) {
        axios.get(`${API_BASE}/user-posts?author_id=${userId}`)
            .then(res => {
                setPosts(res.data);
                // console.log('API 응답 데이터:', res.data);
        })
            .catch(err => console.error(err));
        }
    }, [userId]);

    const PostItem = ({ post }) => {
        return (
        <div className="post-card">
            <Link to={`/detail/${post.id}`} state={{ backgroundLocation: location }}>
                <img src={`${API_BASE}/uploads/${post.file_name}`} alt={post.title} />
            <div className='g_cover'>
            <img src={`${API_BASE}/uploads/${post.img}`} alt="profile" />
            <p>{post.title}</p>
            </div>
            </Link>
        </div>
        );
    };

    return (
        <section className='profile'>
            <div className='bg'>
                {background && (
                    <video src={background.video} alt={`배경 ${backgroundImages.id}`} autoPlay loop muted/>
                )}
            </div>
            <article className='showcase'>
                {posts.length > 0 && (
                <div className='user_profile'>
                    <div className='user_pic'> 
                    <img src={`${API_BASE}/uploads/${posts[0].img}`} alt="프로필 이미지" />
                    </div>
                    <div className='user_info'>
                        {console.log(posts)}
                        <p className='user_n'>{posts[0].nickname}</p>
                        <p className='user_e'>{posts[0].email}</p>
                        <p className='user_introT'>자기소개</p>
                        <p className='user_introP'>{posts[0].introduce}</p>
                    </div>
                </div>
                )}
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
                                        // console.log('posts:', posts);
                                        return <PostItem key={`${post.id}-${post.title}`} post={post} />;
                                    })}
                                </div>
                            ) : (
                                <p>등록된 작품이 없습니다.</p>
                            )
                        ) : null}
                    </div>
                </div>
            </article>
        </section>
    );
}

export default UserInfo;
