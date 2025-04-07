import React from 'react';
import Link from 'next/link';
import SubscribeForm from './SubscribeForm'; // Import the reusable SubscribeForm

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

        {/* Subscribe section */}
        <div className="bg-white rounded-md shadow-sm p-6 border border-primary-200">
          <h2 className="text-xl font-bold mb-4 border-b border-primary-200 pb-2">Subscribe</h2>
          <p className="text-primary-700 mb-4">
            Stay updated with the latest posts and resources.
          </p>
          <SubscribeForm /> {/* Use the common SubscribeForm */}
        </div>
      </aside>
  );
};

export default Sidebar;