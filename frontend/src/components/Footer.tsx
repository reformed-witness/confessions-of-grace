import { Link } from 'react-router-dom';
import SubscribeForm from './SubscribeForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-primary-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Confessions of Grace</h3>
            <p className="text-primary-300">
              A blog dedicated to exploring the doctrines of grace and Reformed theology.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-primary-300 hover:text-white">Home</Link></li>
              <li><Link to="/about" className="text-primary-300 hover:text-white">About</Link></li>
              <li><Link to="/posts" className="text-primary-300 hover:text-white">Archive</Link></li>
              <li><Link to="/confession" className="text-primary-300 hover:text-white">1689 Confession</Link></li>
              <li><Link to="/resources" className="text-primary-300 hover:text-white">Resources</Link></li>
              <li>
                <a
                  href="https://www.etsy.com/shop/ConfessionsOfGrace"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-300 hover:text-white"
                >
                  Shop
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Subscribe</h3>
            <p className="mb-4 text-primary-300">Stay updated with the latest posts.</p>
            <SubscribeForm placeholder="Your email" buttonLabel="Subscribe" />
          </div>
        </div>
        <div className="mt-8 border-t border-primary-700 pt-8 text-center text-primary-400">
          <p>&copy; {currentYear} Confessions of Grace. All rights reserved.</p>
          <p className="mt-2 text-sm">
            &ldquo;For by grace you have been saved through faith. And this is not your own doing; it is the
            gift of God.&rdquo; — Ephesians 2:8
          </p>
        </div>
      </div>
    </footer>
  );
}
