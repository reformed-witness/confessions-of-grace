export const dynamic = 'force-dynamic';

import React from 'react';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { getSortedPostsData } from '@/lib/posts';
import { PostMetadata } from '@/types';
import Image from 'next/image';

// This function runs on the server during build time
async function getHomeData() {
  const posts = await getSortedPostsData();

  // Create tag data
  const allTags = posts.flatMap(post => post.tags);
  const tagCounts: Record<string, number> = {};

  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  const tags = Object.entries(tagCounts).map(([tag, count]) => ({
    tag,
    count
  }));

  return {
    posts,
    recentPosts: posts.slice(0, 5).map(post => ({
      id: post.id,
      title: post.title,
      date: post.date
    })),
    tags
  };
}

// Make the component async
export default async function Home() {
  // Fetch data directly in the component
  const { posts, recentPosts, tags } = await getHomeData();

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <main className="md:w-2/3">
        {posts.length > 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 bg-accent relative w-full md:w-1/3 h-64 md:h-auto">
                  {posts[0].coverImage ? (
                    <Image
                      src={posts[0].coverImage}
                      alt={posts[0].title}
                      className="h-full w-full object-cover"
                      width={1000}
                      height={1000}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-accent text-white text-6xl font-bold">
                      CG
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-accent font-semibold">
                    Latest Post
                  </div>
                  <a 
                    href={`/posts/${posts[0].id}`}
                    className="block mt-1 text-2xl leading-tight font-bold text-primary-900 hover:text-accent-dark"
                  >
                    {posts[0].title}
                  </a>
                  <p className="mt-2 text-primary-600">
                    {posts[0].excerpt}
                  </p>
                  <div className="mt-4">
                    <a 
                      href={`/posts/${posts[0].id}`}
                      className="inline-flex items-center text-accent-dark hover:text-accent"
                    >
                      Read more
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold border-b border-primary-200 pb-2 mb-6">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.slice(1).map((post) => (
              <PostCard key={post.id} post={post}/>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <a href="/posts" className="button">
            View All Posts
          </a>
        </div>
      </main>

      <div className="md:w-1/3">
        <Sidebar recentPosts={recentPosts} tags={tags}/>
      </div>
    </div>
  );
}