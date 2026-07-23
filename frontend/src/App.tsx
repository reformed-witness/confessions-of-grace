import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostsPage from './pages/PostsPage';
import PostPage from './pages/PostPage';
import AuthorsPage from './pages/AuthorsPage';
import AuthorPage from './pages/AuthorPage';
import TagsPage from './pages/TagsPage';
import TagPage from './pages/TagPage';
import ConfessionPage from './pages/ConfessionPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto grow px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:slug" element={<PostPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/authors/:name" element={<AuthorPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/tags/:tag" element={<TagPage />} />
          <Route path="/confession" element={<ConfessionPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
