import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { getSortedPostsData } from '@/lib/markdown';
import { PostMetadata } from '@/types';

interface ArchiveProps {
  posts: PostMetadata[];
  years: number[];
}

const Archive: React.FC<ArchiveProps> = ({ posts, years }) => {
  return (
    <Layout title="Archive | Confessions of Grace">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Archive</h1>
        
        {years.map(year => (
          <div key={year} className="mb-12">
            <h2 className="text-2xl font-bold border-b border-primary-200 pb-2 mb-6">{year}</h2>
            <ul className="space-y-6">
              {posts
                .filter(post => new Date(post.date).getFullYear() === year)
                .map(post => (
                  <li key={post.id} className="bg-white p-6 rounded-md shadow-sm border border-primary-200">
                    <div className="md:flex md:justify-between md:items-center">
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          <Link href={`/posts/${post.id}`} className="hover:text-accent-dark">
                            {post.title}
                          </Link>
                        </h3>
                        <div className="flex items-center mb-2 text-sm text-primary-500">
                          <span>{post.author}</span>
                          <span className="mx-2">•</span>
                          <time dateTime={post.date}>
                            {format(new Date(post.date), 'MMMM d, yyyy')}
                          </time>
                        </div>
                        <p className="text-primary-600">{post.excerpt}</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Link href={`/posts/${post.id}`} className="button text-sm">
                          Read post
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
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
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getSortedPostsData();
  
  // Extract unique years from post dates
  const years = Array.from(new Set(
    posts.map(post => new Date(post.date).getFullYear())
  )).sort((a, b) => b - a); // Sort years in descending order
  
  return {
    props: {
      posts,
      years,
    },
  };
};

export default Archive;