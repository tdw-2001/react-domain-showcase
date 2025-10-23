import React, { useState } from 'react';
import { Card, InfoBox, LoadingSpinner } from '../App';
import { useGemini } from '../hooks/useGemini';
import { generateBlogPost } from '../services/geminiService';

const BlogView: React.FC = () => {
    const [topic, setTopic] = useState('React Hooks');
    const { data: blogPost, isLoading, execute: createPost } = useGemini(generateBlogPost);
    
    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;
        createPost(topic);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <h3 className="text-2xl font-bold mb-4">Blog Content Generator</h3>
                <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-2 mb-6">
                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter a blog topic..." className="flex-grow bg-gray-200 dark:bg-gray-800 border border-brand-border-light dark:border-brand-border rounded-md px-4 py-2 focus:ring-2 focus:ring-brand-blue focus:outline-none" />
                    <button type="submit" disabled={isLoading} className="bg-brand-blue text-white font-bold px-6 py-2 rounded-md hover:bg-opacity-80 transition-colors disabled:bg-gray-500">{isLoading ? 'Generating...' : 'Generate Post'}</button>
                </form>
                
                {isLoading && <LoadingSpinner />}

                {blogPost && (
                    <article className="prose prose-invert prose-lg max-w-none text-brand-text-primary-light dark:text-brand-text-primary">
                        <h2 className="text-3xl font-bold !text-brand-text-primary-light dark:!text-brand-text-primary">{blogPost.title}</h2>
                        <p className="leading-relaxed whitespace-pre-wrap">{blogPost.content}</p>
                    </article>
                )}
                <InfoBox>In a real-world scenario, this generated content would be served via a framework like Next.js to be pre-rendered for maximum SEO performance.</InfoBox>
            </Card>
        </div>
    );
};

export default BlogView;
