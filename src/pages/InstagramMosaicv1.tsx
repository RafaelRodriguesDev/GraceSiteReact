// Defina a interface para os posts do Instagram
interface InstagramPost {
    id: string;
    media_type: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO';
    media_url: string;
    caption?: string;
    permalink: string;
  }
  
  // No componente
  import React, { useState, useEffect } from 'react';
  
  export function InstagramMosaic() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const token = process.env.REACT_APP_INSTAGRAM_TOKEN;
    const postLimit = 10;
  
    useEffect(() => {
      async function fetchPosts() {
        try {
          const userId = '1342530686753957';
          const url = `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${token}`;
          const response = await fetch(url);
          const data = await response.json();
          if (data.data) {
            setPosts(data.data.slice(0, postLimit));
          }
        } catch (error) {
          console.error('Erro ao buscar posts do Instagram:', error);
        }
      }
  
      fetchPosts();
    }, [token]);
  
    if (posts.length === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: -1 }}>
          <p className="text-white">Carregando...</p>
        </div>
      );
    }
  
    return (
      <div
        className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 opacity-40"
        style={{ zIndex: -1 }}
      >
        {Array.from({ length: 9 }).map((_, idx) => (
          <div key={idx} className="w-full h-full overflow-hidden">
            {posts[idx % posts.length].media_type === 'IMAGE' ||
            posts[idx % posts.length].media_type === 'CAROUSEL_ALBUM' ? (
              <img
                src={posts[idx % posts.length].media_url}
                alt={posts[idx % posts.length].caption || `Post ${idx}`}
                className="w-full h-full object-cover transition-opacity duration-1000"
              />
            ) : (
              <video
                src={posts[idx % posts.length].media_url}
                className="w-full h-full object-cover transition-opacity duration-1000"
                autoPlay
                loop
                muted
              />
            )}
          </div>
        ))}
      </div>
    );
  }
  