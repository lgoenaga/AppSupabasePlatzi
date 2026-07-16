"use client";

import { useState, useEffect } from "react";
import { PostCard } from "./components/PostCard";

import { createClient } from "./lib/client";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);

  const handleLike = (postId: number | string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          }
          : post
      )
    );
  };

  const supabase = createClient();

  if (!supabase) {
    return <div>Supabase not initialized</div>;
  }

  useEffect(() => {

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
                *,
                user:profiles (
                  username,
                  avatar
                )
              `)
        .not("img_url", "like", "%example.com%")
        .order("created_at", { ascending: false })
        .limit(10);


      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }
      setPosts(data);
      console.log("Posts fetched:", data);
    };

    fetchPosts();

  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card-bg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-center">
          <h1 className="text-2xl font-bold font-sans bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Suplatzigram
          </h1>
        </div>
      </header>

      {/* Feed de posts */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              priority={index === 0}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
