import React, {useEffect, useState} from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/profile.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function UserInfo(props) {
  const { id:userId } = useParams();
  const location = useLocation();
  const tabs = [{ title: '작품' }];
  const [posts, setPosts] = useState([]);
  const [tabmenu, setTabmenu] = useState(tabs[0].title);

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
                <img src={`${process.env.PUBLIC_URL}/images/samples/profile_bg.png`} alt="bg" />
            </div>
            <article className='showcase'>
            {posts.length > 0 && (
              <div className='user_profile'>
                <div className='user_pic'> 
                  <img src={`${API_BASE}/uploads/${posts[0].img}`} alt="프로필 이미지" />
                </div>
                <div className='user_info'>
                    <p className='user_n'>{posts[0].nickname}</p>
                    <p className='user_e'>{posts[0].email}</p>
                    <p className='user_intro'>자기소개</p>
                    <p className='user_introP'></p>
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
