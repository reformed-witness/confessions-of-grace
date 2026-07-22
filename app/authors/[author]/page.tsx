import React from 'react';
import PostCard from '@/components/PostCard';
import { getPostsByAuthor } from '@/lib/posts';
import { getAllAuthors } from '@/lib/authors';
import { PostMetadata } from '@/types';
import { generateMetadata as createMetadata } from '@/components/Metadata';
import type { Metadata } from 'next';
import AuthorProfile from './AuthorProfile';

interface PageProps {
    params: Promise<{ author: string }>;
}

export async function generateStaticParams() {
    const authors = await getAllAuthors();
    return authors.map((author) => ({
        author: author.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { author } = await params;
    const decodedAuthor = decodeURIComponent(author);
    return createMetadata({
        title: `${decodedAuthor} | Author`,
        description: `Posts authored by ${decodedAuthor} on Confessions of Grace.`,
        url: `https://confessionsofgrace.com/authors/${author}`,
        type: 'website'
    });
}

async function getPostsByAuthorData(author: string): Promise<PostMetadata[]> {
    return await getPostsByAuthor(author);
}

export default async function AuthorPage({ params }: PageProps) {
    const { author } = await params;
    const decodedAuthor = decodeURIComponent(author);
    const posts = await getPostsByAuthorData(decodedAuthor);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AuthorProfile author={decodedAuthor} posts={posts} />

            {/* Posts */}
            <p className="text-lg text-primary-600 mb-6">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} authored by &quot;{decodedAuthor}&quot;
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
