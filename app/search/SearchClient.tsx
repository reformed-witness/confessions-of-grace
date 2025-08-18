'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import { PostMetadata } from '@/types';

interface SearchClientProps {
    allPosts: PostMetadata[];
}

export default function SearchClient({ allPosts }: SearchClientProps) {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [searchResults, setSearchResults] = useState<PostMetadata[]>([]);

    useEffect(() => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const searchTerms = query.toLowerCase().trim().split(/\s+/);

        const filteredPosts = allPosts.filter(post => {
            const titleMatch = searchTerms.some(term =>
                post.title.toLowerCase().includes(term)
            );

            const excerptMatch = searchTerms.some(term =>
                post.excerpt.toLowerCase().includes(term)
            );

            const tagMatch = post.tags.some(tag =>
                searchTerms.some(term => tag.toLowerCase().includes(term))
            );

            return titleMatch || excerptMatch || tagMatch;
        });

        setSearchResults(filteredPosts);
    }, [query, allPosts]);

    return (
        <>
            <div className="mb-8">
                <SearchBar />
            </div>

            {query.trim() ? (
                <>
                    <p className="mb-8 text-primary-600">
                        {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{query}"
                    </p>

                    {searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {searchResults.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-8 border border-primary-200 text-center">
                            <p className="text-xl text-primary-600 mb-4">No results found for "{query}"</p>
                            <p className="text-primary-500">Try using different keywords or browse all posts.</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 border border-primary-200">
                    <p className="text-xl text-primary-600 mb-4 text-center">Enter a search term to find posts</p>
                </div>
            )}
        </>
    );
}