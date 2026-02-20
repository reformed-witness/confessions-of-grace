import React from 'react';
import PostCard from '@/components/PostCard';
import { getPostsByTag } from '@/lib/posts';
import { PostMetadata } from '@/types';
import { generateMetadata as createMetadata } from '@/components/Metadata';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ tag: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    return createMetadata({
        title: `Posts tagged "${decodedTag}"`,
        description: `Browse all posts tagged with "${decodedTag}" on Confessions of Grace.`,
        url: `https://confessionsofgrace.com/tags/${tag}`,
        type: 'website'
    });
}

async function getPostsByTagData(tag: string): Promise<PostMetadata[]> {
    const decodedTag = decodeURIComponent(tag);
    return await getPostsByTag(decodedTag);
}

export default async function TagPage({ params }: PageProps) {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    const posts = await getPostsByTagData(tag);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Tag: {decodedTag}</h1>
                <p className="text-lg text-primary-600">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with "{decodedTag}"
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
    );
}