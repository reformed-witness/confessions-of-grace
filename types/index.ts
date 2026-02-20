export interface PostData {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  coverImage?: string;
}

export interface PostMetadata {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  coverImage?: string;
}

export interface PostFormData {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: "super_admin" | "admin" | "editor";
  created_at: string;
}

export interface Comment {
  id: number;
  name: string;
  email: string;
  comment: string;
  post_id: string;
  created_at: string;
}

export interface Subscription {
  id: number;
  email: string;
  created_at: string;
}

export interface Author {
  name: string;
  bio: string;
  x_link?: string;
  fb_link?: string;
  insta_link?: string;
  pfp_link?: string;
}
