import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { getSortedPostsData, getPostsByTag } from '@/lib/markdown';
import { PostMetadata } from '@/types';

interface TagPageProps {
  posts: PostMetadata[];
  tag: string;
}

const TagPage: React.FC<TagPageProps> = ({ posts, tag }) => {
  return (
    <Layout title={`${tag} | Confessions of Grace`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Tag: {tag}</h1>
          <p className="text-lg text-primary-600">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with "{tag}"
          </p>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-primary-500">No posts found with this tag.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getSortedPostsData();
  const tags = Array.from(new Set(posts.flatMap(post => post.tags)));
  
  const paths = tags.map((tag) => ({
    params: { tag },
  }));
  
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tag = params?.tag as string;
  const posts = getPostsByTag(tag);
  
  return {
    props: {
      posts,
      tag,
    },
  };
};

export default TagPage;