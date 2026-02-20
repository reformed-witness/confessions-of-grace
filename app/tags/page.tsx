export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { generateMetadata as createMetadata } from '@/components/Metadata';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        title: 'Tags',
        description: 'Browse all tags used on Confessions of Grace to find posts by topic.',
        url: 'https://confessionsofgrace.com/tags',
        type: 'website'
    });
}

async function getAllTags(): Promise<{ tag: string; count: number }[]> {
    try {
        const posts = await getSortedPostsData();
        const tagCount: { [key: string]: number } = {};

        // Count occurrences of each tag
        posts.forEach(post => {
            post.tags.forEach(tag => {
                if (tag && tag.trim() !== '') {
                    tagCount[tag] = (tagCount[tag] || 0) + 1;
                }
            });
        });

        // Convert to array and sort by count (descending) then by name
        return Object.entries(tagCount)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => {
                if (b.count !== a.count) return b.count - a.count;
                return a.tag.localeCompare(b.tag);
            });
    } catch (error) {
        console.error('Error getting tags:', error);
        return [];
    }
}

export default async function TagsPage() {
    const tags = await getAllTags();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Browse by Tag</h1>

            <p className="text-lg text-primary-700 mb-8">
                Explore posts organized by topic. Click on any tag to see all posts with that tag.
            </p>

            {tags.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {tags.map(({ tag, count }) => (
                        <Link
                            key={tag}
                            href={`/tags/${encodeURIComponent(tag)}`}
                            className="bg-white border border-primary-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-primary-700">{tag}</span>
                                <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm">
                                    {count} {count === 1 ? 'post' : 'posts'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-xl text-primary-500">No tags found.</p>
                </div>
            )}
        </div>
    );
}