import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Confessions of Grace</h3>
            <p className="text-primary-300">
              A blog dedicated to exploring the doctrines of grace and Reformed theology.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-primary-300 hover:text-white">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-primary-300 hover:text-white">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Subscribe</h3>
            <p className="text-primary-300 mb-4">
              Stay updated with the latest posts.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-md bg-primary-700 border border-primary-600 text-white placeholder-primary-400"
              />
              <button className="bg-accent hover:bg-accent-dark px-4 py-2 rounded-r-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-400">
          <p>&copy; {currentYear} Confessions of Grace. All rights reserved.</p>
          <p className="mt-2 text-sm">
            "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God." — Ephesians 2:8
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;