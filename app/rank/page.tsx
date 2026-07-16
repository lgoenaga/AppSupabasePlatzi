"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "../lib/client";
import { HeartIcon } from "../components/HeartIcon";

function Modal({
  post,
  onClose,
}: {
  post: any;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-card-bg rounded-xl overflow-hidden max-w-lg w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white font-mono"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={post.user.avatar}
              alt={post.user.username}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>

          <div>
            <p className="font-bold font-sans">{post.user.username}</p>
          </div>
        </div>

        <div className="relative w-full aspect-square">
          <Image
            src={post.img_url}
            alt={post.label}
            fill
            sizes="(max-width: 768px) 100vw, 512px"
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <span className="font-bold font-sans">
            {post.likes.toLocaleString()} likes
          </span>

          <p className="mt-2">
            <span className="font-semibold font-sans">{post.user.username}</span>{" "}
            {post.label}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RankPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          user:profiles (
            username,
            avatar
          )
        `)
        .gt("likes", 50)
        .not("img_url", "like", "%example.com%")
        .order("likes", { ascending: false })
        .limit(12);

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      setPosts(data ?? []);
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card-bg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-center">
          <h1 className="text-xl font-bold font-sans bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ranking
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-2">
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post, index) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="relative aspect-square overflow-hidden group"
            >
              <Image
                src={post.img_url}
                alt={`Post con ${post.likes} likes`}
                fill
                sizes="33vw"
                priority={index === 0}
                className="object-cover transition-transform group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <HeartIcon filled size="sm" />
                <span className="text-white font-semibold font-mono">
                  {post.likes.toLocaleString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {selectedPost && (
        <Modal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
