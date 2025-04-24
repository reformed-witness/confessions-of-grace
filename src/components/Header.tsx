import React from 'react';
import Link from 'next/link';
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-primary-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link href="/" className="no-underline">
            <div className="mb-4 md:mb-0 flex items-center space-x-4">
            
              <Image
              src="/assets/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="h-auto w-auto max-h-12"
              />
            
            <div>
              
              <h1 className="text-3xl font-bold text-primary-900 mb-0">Confessions of Grace</h1>
              
              <p className="text-primary-500 italic text-sm">Confessing Christ. Rejoicing in Grace.</p>
            </div>
            </div>
          </Link>
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
            <Link href="https://www.etsy.com/shop/ConfessionsOfGrace" className="text-primary-700 hover:text-accent-dark">
              Shop
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;