import React from 'react';
import { generateMetadata as createMetadata } from '@/components/Metadata';
import type { Metadata } from 'next';

interface Resource {
    title: string;
    author: string;
    description: string;
    link?: string;
    category: string;
}

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        title: 'Reformed Resources',
        description: 'A curated collection of Reformed theology resources including confessions, books, and websites for deepening understanding of the doctrines of grace.',
        url: 'https://confessionsofgrace.com/resources',
        type: 'website'
    });
}

export default function ResourcesPage() {
    const resources: Resource[] = [
        {
            title: "The Second London Baptist Confession of Faith (1689)",
            author: "Particular Baptists",
            description: "A historic Reformed Baptist confession of faith that aligns closely with the Westminster Confession but reflects Baptist distinctives.",
            link: "/confession",
            category: "Confessions"
        },
        {
            title: "The Heidelberg Catechism",
            author: "Zacharias Ursinus & Caspar Olevianus",
            description: "A warm, pastoral Reformed catechism organized around comfort in Christ.",
            link: "https://www.ligonier.org/learn/articles/heidelberg-catechism",
            category: "Confessions"
        },
        {
            title: "Ligonier Ministries",
            author: "Founded by R.C. Sproul",
            description: "A ministry dedicated to helping Christians know what they believe, why they believe it, how to live it, and how to share it.",
            link: "https://www.ligonier.org/",
            category: "Websites"
        },
        {
            title: "Monergism",
            author: "",
            description: "A comprehensive resource for Reformed theology, including articles, books, and audio resources.",
            link: "https://www.monergism.com/",
            category: "Websites"
        },
        {
            title: "Church Finder",
            author: "",
            description: "Find a Reformed Baptist church near you using our interactive map.",
            link: "/church-finder",
            category: "Websites"
        }
    ];

    const categories = Array.from(new Set(resources.map(resource => resource.category)));

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Reformed Resources</h1>

            <p className="text-lg text-primary-700 mb-10">
                This is a curated collection of resources related to Reformed theology and the doctrines of grace.
                These books, confessions, and websites have been formative in my own theological journey and
                are recommended for those seeking to deepen their understanding of Reformed thought.
            </p>

            {categories.map(category => (
                <div key={category} className="mb-12">
                    <h2 className="text-2xl font-bold border-b border-primary-200 pb-2 mb-6">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resources
                            .filter(resource => resource.category === category)
                            .map((resource, index) => (
                                <div key={index}
                                     className="bg-white rounded-lg shadow-sm p-6 border border-primary-200">
                                    <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                                    {resource.author && (
                                        <p className="text-primary-500 italic mb-3">by {resource.author}</p>
                                    )}
                                    <p className="text-primary-700 mb-4">{resource.description}</p>
                                    {resource.link && (
                                        <a
                                            href={resource.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-accent-dark hover:text-accent"
                                        >
                                            Visit Resource
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 ml-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}