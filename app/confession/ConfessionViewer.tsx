'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ConfessionViewerProps {
    confession: {
        title: string;
        chapters: {
            [key: string]: {
                title: string;
                paragraphs: {
                    [key: string]: string;
                };
            };
        };
    };
    verses: {
        [key: string]: string;
    };
}

export default function ConfessionViewer({ confession, verses }: ConfessionViewerProps) {
    const [activeChapter, setActiveChapter] = useState<string>("1");
    const [showScripture, setShowScripture] = useState<boolean>(true);

    // Get sorted chapter numbers
    const chapterNumbers = Object.keys(confession.chapters).sort((a, b) =>
        parseInt(a) - parseInt(b)
    );

    // Function to render Bible references as links with tooltips
    const renderTextWithReferences = (text: string) => {
        const regex = /\b(?:\d\s+)?[A-Za-z]+\s+\d+:\d+(?:-\d+)?(?:,\s+\d+(?:-\d+)?)*\b/g;
        const parts = text.split(regex);
        const matches = text.match(regex) || [];

        if (matches.length === 0) return text;

        return parts.reduce((result: React.ReactNode[], part, i) => {
            result.push(part);
            if (i < matches.length) {
                const reference = matches[i];
                const verseText = verses[reference];

                if (verseText && showScripture) {
                    result.push(
                        <span key={i} className="relative group">
                            <span className="text-accent-dark cursor-pointer underline">
                                {reference}
                            </span>
                            <span className="absolute left-0 -bottom-2 transform translate-y-full bg-white border border-primary-200 p-3 rounded-md shadow-lg w-64 hidden group-hover:block z-10 text-sm text-primary-700">
                                <strong>{reference}</strong>: {verseText}
                            </span>
                        </span>
                    );
                } else {
                    result.push(
                        <span key={i} className="text-accent-dark">
                            {reference}
                        </span>
                    );
                }
            }
            return result;
        }, []);
    };

    return (
        <>
            {/* Uncomment this section if you want the introduction and controls */}
            {/* <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-primary-200">
                <p className="text-primary-700 mb-4">
                    The 1689 Baptist Confession of Faith, also called the Second London Baptist Confession, was written by Particular Baptists in England who were concerned that their Calvinistic theological positions would be misunderstood.
                </p>
                <p className="text-primary-700 mb-4">
                    This confession follows the Westminster Confession of Faith and the Savoy Declaration in its doctrine, but with Baptist distinctives related to baptism and church polity.
                </p>
                <div className="flex mb-2 mt-6">
                    <button
                        onClick={() => setShowScripture(!showScripture)}
                        className="button text-sm"
                    >
                        {showScripture ? 'Hide Scripture Tooltips' : 'Show Scripture Tooltips'}
                    </button>
                    <p className="ml-3 text-sm text-primary-500 self-center">
                        {showScripture ? 'Hover over references to see Scripture text' : 'Scripture tooltips are hidden'}
                    </p>
                </div>
            </div> */}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="md:w-1/4">
                    <div className="bg-white rounded-lg shadow-sm border border-primary-200 sticky top-4">
                        <h2 className="text-xl font-bold p-4 border-b border-primary-200">Chapters</h2>
                        <div className="overflow-y-auto max-h-[70vh] p-2">
                            {chapterNumbers.map(chapterNum => (
                                <button
                                    key={chapterNum}
                                    onClick={() => setActiveChapter(chapterNum)}
                                    className={`w-full text-left p-3 rounded-md my-1 transition-colors ${
                                        activeChapter === chapterNum
                                            ? 'bg-accent text-white'
                                            : 'text-primary-700 hover:bg-primary-50'
                                    }`}
                                >
                                    <span className="font-bold">Chapter {chapterNum}</span>
                                    <br />
                                    <span className="text-sm">
                                        {confession.chapters[chapterNum].title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:w-3/4">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-primary-200">
                        <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-primary-200">
                            Chapter {activeChapter}: {confession.chapters[activeChapter].title}
                        </h2>

                        {Object.keys(confession.chapters[activeChapter].paragraphs).map(paraNum => (
                            <div key={paraNum} className="mb-8 last:mb-0" id={`${activeChapter}-${paraNum}`}>
                                <h3 className="font-bold text-lg mb-3 flex items-baseline">
                                    <span className="bg-accent text-white w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm flex-shrink-0">
                                        {paraNum}
                                    </span>
                                    <Link
                                        href={`#${activeChapter}-${paraNum}`}
                                        className="hover:text-accent-dark"
                                    >
                                        Paragraph {paraNum}
                                    </Link>
                                </h3>
                                <p className="text-primary-700 leading-relaxed">
                                    {renderTextWithReferences(confession.chapters[activeChapter].paragraphs[paraNum])}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-6">
                        {parseInt(activeChapter) > 1 && (
                            <button
                                onClick={() => setActiveChapter((parseInt(activeChapter) - 1).toString())}
                                className="bg-white text-primary-700 border border-primary-200 px-4 py-2 rounded-md hover:bg-primary-50 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous Chapter
                            </button>
                        )}

                        {parseInt(activeChapter) < chapterNumbers.length && (
                            <button
                                onClick={() => setActiveChapter((parseInt(activeChapter) + 1).toString())}
                                className="bg-white text-primary-700 border border-primary-200 px-4 py-2 rounded-md hover:bg-primary-50 flex items-center ml-auto"
                            >
                                Next Chapter
                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}