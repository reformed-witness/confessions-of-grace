import React from 'react';
import confessionData from '@/data/1689-confession.json';
import verseReferences from '@/data/1689-verses.json';
import { generateMetadata as createMetadata } from '@/components/Metadata';
import type { Metadata } from 'next';
import ConfessionViewer from './ConfessionViewer';

interface ConfessionData {
    title: string;
    chapters: {
        [key: string]: {
            title: string;
            paragraphs: {
                [key: string]: string;
            };
        };
    };
}

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        title: '1689 Baptist Confession of Faith',
        description: 'Read the complete 1689 Baptist Confession of Faith, also known as the Second London Baptist Confession, with Scripture references.',
        url: 'https://confessionsofgrace.com/1689-confession',
        type: 'website'
    });
}

async function getConfessionData(): Promise<{
    confession: ConfessionData;
    verses: { [key: string]: string };
}> {
    return {
        confession: confessionData,
        verses: verseReferences,
    };
}

export default async function ConfessionPage() {
    const { confession, verses } = await getConfessionData();

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">The Baptist Confession of Faith of 1689</h1>
            <ConfessionViewer confession={confession} verses={verses} />
        </div>
    );
}