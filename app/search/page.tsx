import React from 'react';
import { getSortedPostsData } from '@/lib/markdown';
import { PostMetadata } from '@/types';
import { generateMetadata as createMetadata } from '@/components/Metadata';
import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        title: 'Search Posts',
        description: 'Search through all posts on Confessions of Grace by title, content, or tags.',
        url: 'https://confessionsofgrace.com/search',
        type: 'website'
    });
}

async function getAllPosts(): Promise<PostMetadata[]> {
    return getSortedPostsData();
}

export default async function SearchPage() {
    const allPosts = await getAllPosts();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Search Results</h1>
            <SearchClient allPosts={allPosts} />
        </div>
    );
}