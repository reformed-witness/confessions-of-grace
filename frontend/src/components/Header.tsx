import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { logout } from '../api';

export default function Header() {
  const { me } = useAuth();

  return (
    <header className="border-b border-primary-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <Link to="/" className="no-underline">
            <div className="mb-4 flex items-center space-x-4 md:mb-0">
              <img src="/assets/logo.svg" alt="Confessions of Grace" className="h-auto max-h-12 w-auto" />
              <div>
                <h1 className="mb-0 text-3xl font-bold text-primary-900">Confessions of Grace</h1>
                <p className="text-sm italic text-primary-500">Confessing Christ. Rejoicing in Grace.</p>
              </div>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/" className="text-primary-700 hover:text-accent-dark">Home</Link>
            <Link to="/about" className="text-primary-700 hover:text-accent-dark">About</Link>
            <Link to="/posts" className="text-primary-700 hover:text-accent-dark">Archive</Link>
            <Link to="/confession" className="text-primary-700 hover:text-accent-dark">1689 Confession</Link>
            <Link to="/resources" className="text-primary-700 hover:text-accent-dark">Resources</Link>
            <a
              href="https://www.etsy.com/shop/ConfessionsOfGrace"
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 hover:text-accent-dark"
            >
              Shop
            </a>
            {me?.admin && (
              <>
                <Link to="/admin" className="font-semibold text-accent-dark hover:text-accent">Admin</Link>
                <button onClick={() => logout()} className="text-primary-500 hover:text-accent-dark">
                  Sign out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
