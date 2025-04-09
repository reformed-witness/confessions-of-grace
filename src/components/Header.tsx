import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-primary-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="no-underline">
              <h1 className="text-3xl font-bold text-primary-900 mb-0">Confessions of Grace</h1>
            </Link>
            <p className="text-primary-500 italic text-sm">Exploring Reformed Theology</p>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-primary-700 hover:text-accent-dark">
              Home
            </Link>
            <Link href="/about" className="text-primary-700 hover:text-accent-dark">
              About
            </Link>
            <Link href="/archive" className="text-primary-700 hover:text-accent-dark">
              Archive
            </Link>
            {/*<Link href="/confession" className="text-primary-700 hover:text-accent-dark">*/}
            {/*  1689 Confession*/}
            {/*</Link>*/}
            <Link href="/resources" className="text-primary-700 hover:text-accent-dark">
              Resources
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;