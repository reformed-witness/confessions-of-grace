import React from 'react';
import Link from 'next/link';
import TagList from './TagList';

interface SidebarProps {
  recentPosts: Array<{
    id: string;
    title: string;
    date: string;
  }>;
  tags?: Array<{
    tag: string;
    count: number;
  }>;
}

const Sidebar: React.FC<SidebarProps> = ({ recentPosts, tags = [] }) => {
  return (
    <aside className="space-y-8">
      <div className="bg-white rounded-md shadow-sm p-6 border border-primary-200">
        <h2 className="text-xl font-bold mb-4 border-b border-primary-200 pb-2">About</h2>
        <p className="text-primary-700 mb-4">
          Confessions of Grace explores the riches of Reformed theology and the doctrines of grace.
        </p>
        <Link 
          href="/about" 
          className="text-accent-dark hover:text-accent inline-flex items-center"
        >
          Learn more
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
      
      <div className="bg-white rounded-md shadow-sm p-6 border border-primary-200">
        <h2 className="text-xl font-bold mb-4 border-b border-primary-200 pb-2">Recent Posts</h2>
        <ul className="space-y-3">
          {recentPosts.map(post => (
            <li key={post.id}>
              <Link 
                href={`/posts/${post.id}`} 
                className="hover:text-accent-dark block"
              >
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-primary-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white rounded-md shadow-sm p-6 border border-primary-200">
        <h2 className="text-xl font-bold mb-4 border-b border-primary-200 pb-2">Popular Tags</h2>
        <TagList limit={15} tags={tags} />
      </div>
      
      <div className="bg-white rounded-md shadow-sm p-6 border border-primary-200">
        <h2 className="text-xl font-bold mb-4 border-b border-primary-200 pb-2">Subscribe</h2>
        <p className="text-primary-700 mb-4">
          Stay updated with the latest posts and resources.
        </p>
        <form className="space-y-3">
          <div>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>
          <button 
            type="submit" 
            className="button w-full"
          >
            Subscribe
          </button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;