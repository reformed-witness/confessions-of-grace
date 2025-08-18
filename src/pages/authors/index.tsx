import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { supabase } from '@/utils/supabase';

interface AuthorProfile {
  name: string;
  bio: string;
  x_link?: string;
  fb_link?: string;
  insta_link?: string;
  pfp_link?: string;
}

interface AuthorsPageProps {
  authors: AuthorProfile[];
}

const AuthorsPage: React.FC<AuthorsPageProps> = ({ authors }) => {
  return (
    <Layout title="Authors | Confessions of Grace">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10 text-center">Meet the Authors</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {authors.map((author) => (
            <Link
              key={author.name}
              href={`/authors/${author.name}`}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center hover:shadow-lg transition-shadow"
            >
              <div className="w-24 h-24 mb-4 relative">
                <Image
                  src={author.pfp_link || '/images/authors/default.jpg'}
                  alt={`${author.name}'s profile`}
                  fill
                  className="rounded-full object-cover"
                  sizes="96px"
                />
              </div>
              <h2 className="text-lg font-semibold">{author.name}</h2>
              {/* You can include bio or social icons here */}
            </Link>
          ))}
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
  try {
    const { data: authorsData, error } = await supabase
      .from('authors')
      .select('name, bio, x_link, fb_link, insta_link, pfp_link');

    if (error || !authorsData) {
      console.error('Error fetching authors:', error);
      // Return empty array for static export fallback
      return { props: { authors: [] } };
    }

    return {
      props: {
        authors: authorsData,
      },
    };
  } catch (error) {
    console.error('Failed to fetch authors during build:', error);
    // Fallback for static export when Supabase is not available during build
    return { props: { authors: [] } };
  }
};

export default AuthorsPage;
