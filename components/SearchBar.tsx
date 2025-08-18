import { useRouter } from 'next/router';
import React, { useState } from 'react';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-primary-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      />
      <button 
        type="submit" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400"
        aria-label="Search"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;