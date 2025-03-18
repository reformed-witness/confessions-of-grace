import React from 'react';
import Link from 'next/link';

interface TagListProps {
  className?: string;
  limit?: number;
  tags?: Array<{
    tag: string;
    count: number;
  }>;
}

const TagList: React.FC<TagListProps> = ({ className = '', limit, tags = [] }) => {
  // Sort tags by count (descending)
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);
  
  // Apply limit if provided
  const tagsToShow = limit ? sortedTags.slice(0, limit) : sortedTags;
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tagsToShow.map(({ tag, count }) => (
        <Link 
          key={tag} 
          href={`/tags/${tag}`}
          className="bg-primary-100 text-primary-700 px-3 py-1 rounded-md hover:bg-primary-200 text-sm transition-colors duration-200 flex items-center"
        >
          {tag}
          <span className="ml-1 text-xs bg-primary-200 rounded-full px-2 py-0.5">
            {count}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default TagList;