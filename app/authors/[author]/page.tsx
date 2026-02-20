import React from 'react';
import PostCard from '@/components/PostCard';
import { getPostsByAuthor } from '@/lib/posts';
import { PostMetadata } from '@/types';
import { generateMetadata as createMetadata } from '@/components/Metadata';
import type { Metadata } from 'next';
import AuthorProfile from './AuthorProfile';

interface PageProps {
    params: Promise<{ author: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { author } = await params;
    return createMetadata({
        title: `${author} | Author`,
        description: `Posts authored by ${author} on Confessions of Grace.`,
        url: `https://confessionsofgrace.com/authors/${author}`,
        type: 'website'
    });
}

async function getPostsByAuthorData(author: string): Promise<PostMetadata[]> {
    return await getPostsByAuthor(author);
}

export default async function AuthorPage({ params }: PageProps) {
    const { author } = await params;
    const posts = await getPostsByAuthorData(author);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AuthorProfile author={author} posts={posts} />

            {/* Posts */}
            <p className="text-lg text-primary-600 mb-6">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} authored by "{author}"
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
    );
}