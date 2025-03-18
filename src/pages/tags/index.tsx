import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getSortedPostsData } from '@/lib/markdown';
import { PostMetadata } from '@/types';

interface TagsPageProps {
  tags: {
    name: string;
    count: number;
  }[];
}

const TagsPage: React.FC<TagsPageProps> = ({ tags }) => {
  return (
    <Layout title="Tags | Confessions of Grace">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Browse by Tag</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 border border-primary-200">
          <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
              <Link 
                key={tag.name} 
                href={`/tags/${tag.name}`}
                className="bg-primary-100 hover:bg-primary-200 text-primary-700 px-4 py-2 rounded-md text-lg transition-colors duration-200 flex items-center"
              >
                {tag.name}
                <span className="ml-2 bg-primary-200 rounded-full px-2 py-0.5 text-sm">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/archive" className="button">
            View All Posts
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getSortedPostsData();
  
  // Extract all tags from posts
  const allTags = posts.flatMap(post => post.tags);
  
  // Count occurrences of each tag
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to array and sort alphabetically
  const tags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  return {
    props: {
      tags,
    },
  };
};

export default TagsPage;