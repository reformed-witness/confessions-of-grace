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