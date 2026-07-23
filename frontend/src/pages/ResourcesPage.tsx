interface Resource {
  title: string;
  author: string;
  description: string;
  link?: string;
  category: string;
}

const resources: Resource[] = [
  {
    title: 'The Second London Baptist Confession of Faith (1689)',
    author: 'Particular Baptists',
    description:
      'A historic Reformed Baptist confession of faith that aligns closely with the Westminster Confession but reflects Baptist distinctives.',
    link: '/confession',
    category: 'Confessions',
  },
  {
    title: 'The Heidelberg Catechism',
    author: 'Zacharias Ursinus & Caspar Olevianus',
    description: 'A warm, pastoral Reformed catechism organized around comfort in Christ.',
    link: 'https://www.ligonier.org/learn/articles/heidelberg-catechism',
    category: 'Confessions',
  },
  {
    title: 'Ligonier Ministries',
    author: 'Founded by R.C. Sproul',
    description:
      'A ministry dedicated to helping Christians know what they believe, why they believe it, how to live it, and how to share it.',
    link: 'https://www.ligonier.org/',
    category: 'Websites',
  },
  {
    title: 'Monergism',
    author: '',
    description: 'A comprehensive resource for Reformed theology, including articles, books, and audio resources.',
    link: 'https://www.monergism.com/',
    category: 'Websites',
  },
];

export default function ResourcesPage() {
  const categories = Array.from(new Set(resources.map((r) => r.category)));

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Reformed Resources</h1>

      <p className="mb-10 text-lg text-primary-700">
        This is a curated collection of resources related to Reformed theology and the doctrines of grace. These
        books, confessions, and websites have been formative in my own theological journey and are recommended for
        those seeking to deepen their understanding of Reformed thought.
      </p>

      {categories.map((category) => (
        <div key={category} className="mb-12">
          <h2 className="mb-6 border-b border-primary-200 pb-2 text-2xl font-bold">{category}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {resources
              .filter((r) => r.category === category)
              .map((r) => (
                <div key={r.title} className="rounded-lg border border-primary-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-2 text-xl font-bold">{r.title}</h3>
                  {r.author && <p className="mb-3 italic text-primary-500">by {r.author}</p>}
                  <p className="mb-4 text-primary-700">{r.description}</p>
                  {r.link && (
                    <a
                      href={r.link}
                      target={r.link.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-accent-dark hover:text-accent"
                    >
                      Visit Resource
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
