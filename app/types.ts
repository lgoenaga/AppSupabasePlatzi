export interface Post {
  id: number | string;
  user?: {
    username: string;
    avatar: string;
  };
  img_url: string;
  label: string;
  likes: number;
  isLiked?: boolean;
  created_at: Date;
  updated_at?: Date;
}

export interface PostCardProps {
  post: Post;
  onLike: (id: number | string) => void;
  priority?: boolean;
}