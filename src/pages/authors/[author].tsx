import React, { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { getSortedPostsData, getPostsByAuthor } from '@/lib/markdown';
import { PostMetadata } from '@/types';
import { supabase } from '@/utils/supabase';

interface AuthorProfile {
  name: string;
  bio: string;
  x_link?: string;
  fb_link?: string;
  insta_link?: string;
  pfp_link?: string;
}

interface AuthorPageProps {
  posts: PostMetadata[];
  author: string;
}

const AuthorPage: React.FC<AuthorPageProps> = ({ posts, author }) => {
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(null);

  const fetchAuthorProfile = async () => {
    const { data, error } = await supabase
      .from('authors')
      .select('name, bio, x_link, fb_link, insta_link, pfp_link')
      .eq('name', author) // Or use slug if you've switched to that
      .single();

    if (error) {
      console.warn('No author profile found for:', author, '→', error.message);
    }

    if (data) {
      setAuthorProfile(data);
    }
  };

  useEffect(() => {
    fetchAuthorProfile();
  }, [author]);

  return (
    <Layout title={`${authorProfile?.name || author} | Confessions of Grace`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Picture */}
          {authorProfile?.pfp_link ? (
            <img
              src={authorProfile.pfp_link}
              alt={`${authorProfile.name}'s profile picture`}
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
              ?
            </div>
          )}

          <div>
            {/* Author Name */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {authorProfile?.name || author}
            </h1>

            {/* Author Bio */}
            {authorProfile?.bio && (
              <p className="text-primary-600 mb-2">{authorProfile.bio}</p>
            )}

            {/* Social Links */}
            <div className="flex gap-4 mt-2">
              {authorProfile?.x_link && (
                <a
                  href={authorProfile.x_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/icons/x.svg" alt="X (Twitter)" className="w-5 h-5" />
                </a>
              )}
              {authorProfile?.fb_link && (
                <a
                  href={authorProfile.fb_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
                </a>
              )}
              {authorProfile?.insta_link && (
                <a
                  href={authorProfile.insta_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/icons/instagram.svg" alt="Instagram" className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <p className="text-lg text-primary-600 mb-6">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} authored by{' '}
          "{authorProfile?.name || author}"
        </p>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-primary-500">No posts found for this author.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getSortedPostsData();
  const authors = Array.from(new Set(posts.flatMap(post => post.author)));

  const paths = authors.map((author) => ({
    params: { author },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const author = params?.author as string;
  const posts = getPostsByAuthor(author);

  return {
    props: {
      posts,
      author,
    },
  };
};

export default AuthorPage;
