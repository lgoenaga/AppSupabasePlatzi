"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-red-500"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

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
        .limit(10);

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
                <HeartIcon />
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
