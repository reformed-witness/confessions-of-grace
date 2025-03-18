import React from 'react';
import Layout from '@/components/Layout';

interface Resource {
  title: string;
  author: string;
  description: string;
  link?: string;
  category: string;
}

const Resources: React.FC = () => {
  const resources: Resource[] = [
    {
      title: "Institutes of the Christian Religion",
      author: "John Calvin",
      description: "Calvin's magnum opus on systematic theology, covering the doctrines of God, man, salvation, and the church.",
      category: "Books"
    },
    {
      title: "The Bondage of the Will",
      author: "Martin Luther",
      description: "Luther's defense of the doctrine of total depravity and God's sovereignty in salvation.",
      category: "Books"
    },
    {
      title: "Chosen by God",
      author: "R.C. Sproul",
      description: "A accessible introduction to the doctrine of predestination.",
      category: "Books"
    },
    {
      title: "The Westminster Confession of Faith",
      author: "Westminster Assembly",
      description: "A historic Reformed confession of faith that remains influential today.",
      link: "https://www.pcaac.org/bco/westminster-confession/",
      category: "Confessions"
    },
    {
      title: "The Heidelberg Catechism",
      author: "Zacharias Ursinus & Caspar Olevianus",
      description: "A warm, pastoral Reformed catechism organized around comfort in Christ.",
      link: "https://www.ligonier.org/learn/articles/heidelberg-catechism",
      category: "Confessions"
    },
    {
      title: "Ligonier Ministries",
      author: "Founded by R.C. Sproul",
      description: "A ministry dedicated to helping Christians know what they believe, why they believe it, how to live it, and how to share it.",
      link: "https://www.ligonier.org/",
      category: "Websites"
    },
    {
      title: "Monergism",
      author: "",
      description: "A comprehensive resource for Reformed theology, including articles, books, and audio resources.",
      link: "https://www.monergism.com/",
      category: "Websites"
    }
  ];

const categories = Array.from(new Set(resources.map(resource => resource.category)));

  return (
    <Layout title="Resources | Confessions of Grace">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Reformed Resources</h1>
        
        <p className="text-lg text-primary-700 mb-10">
          This is a curated collection of resources related to Reformed theology and the doctrines of grace.
          These books, confessions, and websites have been formative in my own theological journey and 
          are recommended for those seeking to deepen their understanding of Reformed thought.
        </p>
        
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold border-b border-primary-200 pb-2 mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources
                .filter(resource => resource.category === category)
                .map((resource, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-primary-200">
                    <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                    {resource.author && (
                      <p className="text-primary-500 italic mb-3">by {resource.author}</p>
                    )}
                    <p className="text-primary-700 mb-4">{resource.description}</p>
                    {resource.link && (
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-accent-dark hover:text-accent"
                      >
                        Visit Resource
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 ml-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
        
        <div className="bg-primary-100 rounded-lg p-6 border border-primary-200 mt-10">
          <h2 className="text-xl font-bold mb-4">Suggest a Resource</h2>
          <p className="text-primary-700 mb-4">
            Do you have a resource suggestion that would be valuable for readers of this blog?
            Please use the contact form to share your recommendations.
          </p>
          <a href="#" className="button inline-block">
            Contact
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;