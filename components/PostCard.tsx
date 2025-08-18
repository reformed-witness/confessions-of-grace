import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { PostMetadata } from '@/types';

interface PostCardProps {
  post: PostMetadata;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="card hover:shadow-md transition-shadow duration-200">
      {post.coverImage && (
        <div className="mb-4 relative h-48 w-full overflow-hidden rounded-md">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h2 className="text-xl font-bold mb-2">
        <Link href={`/posts/${post.id}`} className="hover:text-accent-dark">
          {post.title}
        </Link>
      </h2>
      <div className="flex items-center mb-2 text-sm text-primary-500">
        <span>{post.author}</span>
        <span className="mx-2">•</span>
        <time dateTime={post.date}>
          {format(new Date(post.date), 'MMMM d, yyyy')}
        </time>
      </div>
      <p className="text-primary-600 mb-4">{post.excerpt}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map(tag => (
          <Link 
            key={tag} 
            href={`/tags/${tag}`}
            className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-md hover:bg-primary-200"
          >
            {tag}
          </Link>
        ))}
      </div>
      <Link href={`/posts/${post.id}`} className="inline-flex items-center text-accent-dark hover:text-accent">
        Read more
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 ml-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M14 5l7 7m0 0l-7 7m7-7H3" 
          />
        </svg>
      </Link>
    </article>
  );
};

export default PostCard;