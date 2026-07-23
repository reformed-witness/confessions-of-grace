export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  coverImage: string | null;
}

export interface PostDetail extends PostSummary {
  contentHtml: string;
}

export interface AuthorSummary {
  name: string;
  bio: string;
  pfpLink: string | null;
  postCount: number;
}

export interface AuthorPage {
  name: string;
  bio: string;
  xLink: string | null;
  fbLink: string | null;
  instaLink: string | null;
  pfpLink: string | null;
  postCount: number;
  posts: PostSummary[];
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface CommentView {
  id: number;
  name: string;
  body: string;
  createdAt: string | null;
}

export interface MeInfo {
  authenticated: boolean;
  admin: boolean;
  owner: string | null;
}
