import React from 'react';
import {createPageMetadata} from "@/components/Metadata";

export const metadata = createPageMetadata({
    title: "RB Church Finder",
    description: "",
    url: "https://confessionsofgrace.com/church-finder"
});

export default function ChurchFinder() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Find a Reformed Church Near You</h1>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-primary-200 mb-8">
                <p className="text-primary-700 mb-4">
                    Use the map below to search for Reformed Baptist churches in your area. You can zoom in, search by
                    city, or drag the map to explore different regions.
                </p>
                <div className="w-full aspect-video rounded-md overflow-hidden border border-primary-200 shadow-sm">
                    <iframe
                        title="Reformed Church Finder"
                        src="https://www.google.com/maps/d/embed?mid=1lxWCjrZza0cQ8NIen0PMof9r1kg6zsI&ehbc=2E312F"
                        width="100%"
                        height="100%"
                        style={{border: 0}}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
            <div className="text-center text-primary-500 text-sm">
                <p>
                    Want your church listed? <a href="https://reformedbaptistchurches.com/form"
                                                className="text-accent-dark hover:text-accent">Contact us</a> with your
                    church's info!
                </p>
            </div>
        </div>
    );
};