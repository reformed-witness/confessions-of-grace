import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages,
  basePath 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    // Always show first and last page
    // Show 2 pages before and after current page
    const pageNumbers = new Set<number>();
    
    // Add current page
    pageNumbers.add(currentPage);
    
    // Add adjacent pages
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pageNumbers.add(i);
    }
    
    // Always add first and last page
    pageNumbers.add(1);
    pageNumbers.add(totalPages);
    
    // Convert to array and sort
    return Array.from(pageNumbers).sort((a, b) => a - b);
  };
  
  const pageNumbers = getPageNumbers();
  
  // Generate link for a page number
  const getPageLink = (pageNum: number) => {
    if (pageNum === 1) {
      return basePath;
    }
    return `${basePath}/page/${pageNum}`;
  };
  
  return (
    <nav className="flex justify-center my-8">
      <ul className="flex items-center space-x-1">
        {/* Previous page button */}
        {currentPage > 1 && (
          <li>
            <Link
              href={getPageLink(currentPage - 1)}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-primary-200 bg-white text-primary-700 hover:bg-primary-50"
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </li>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map((pageNum, index) => {
          // Add ellipsis if there's a gap
          const showEllipsisBefore = index > 0 && pageNum > pageNumbers[index - 1] + 1;
          
          return (
            <React.Fragment key={pageNum}>
              {showEllipsisBefore && (
                <li className="flex items-center justify-center w-10 h-10 text-primary-500">
                  ...
                </li>
              )}
              <li>
                <Link
                  href={getPageLink(pageNum)}
                  className={`flex items-center justify-center w-10 h-10 rounded-md border ${
                    pageNum === currentPage 
                      ? 'bg-accent text-white border-accent font-bold' 
                      : 'bg-white text-primary-700 border-primary-200 hover:bg-primary-50'
                  }`}
                  aria-current={pageNum === currentPage ? 'page' : undefined}
                >
                  {pageNum}
                </Link>
              </li>
            </React.Fragment>
          );
        })}
        
        {/* Next page button */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={getPageLink(currentPage + 1)}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-primary-200 bg-white text-primary-700 hover:bg-primary-50"
              aria-label="Next page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;