import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="mb-4 text-3xl font-bold md:text-4xl">Page not found</h1>
      <p className="mb-8 text-primary-700">
        We couldn&apos;t find that page. Perhaps start from the <Link to="/">home page</Link> or browse the{' '}
        <Link to="/posts">archive</Link>.
      </p>
      <Link to="/" className="button">Back home</Link>
    </div>
  );
}
