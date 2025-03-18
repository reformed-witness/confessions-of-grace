import React from 'react';
import Layout from '@/components/Layout';

const About: React.FC = () => {
  return (
    <Layout title="About | Confessions of Grace">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">About</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 border border-primary-200 mb-10">
          <h2 className="text-2xl font-bold mb-4">Confessions of Grace</h2>
          <p className="text-primary-700 mb-6">
            Welcome to Confessions of Grace, a blog dedicated to exploring the riches of Reformed theology 
            and the doctrines of grace. Our aim is to articulate timeless biblical truths in a clear, 
            accessible manner, helping believers understand the depth and beauty of God's sovereign grace.
          </p>
          
          <h3 className="text-xl font-bold mb-3">Our Vision</h3>
          <p className="text-primary-700 mb-6">
            In an age of theological confusion and spiritual relativism, we seek to provide content 
            that is firmly rooted in Scripture, historically informed, and pastorally sensitive. 
            We believe that sound doctrine leads to doxology, that theology properly understood 
            results in worship and wonder at the character and works of God.
          </p>
          
          <h3 className="text-xl font-bold mb-3">What We Believe</h3>
          <p className="text-primary-700 mb-6">
            We stand in the tradition of the Protestant Reformation, affirming the five "solas":
          </p>
          <ul className="list-disc list-inside mb-6 text-primary-700 space-y-2">
            <li><span className="font-semibold italic">Sola Scriptura</span> — Scripture Alone</li>
            <li><span className="font-semibold italic">Sola Fide</span> — Faith Alone</li>
            <li><span className="font-semibold italic">Sola Gratia</span> — Grace Alone</li>
            <li><span className="font-semibold italic">Solus Christus</span> — Christ Alone</li>
            <li><span className="font-semibold italic">Soli Deo Gloria</span> — Glory to God Alone</li>
          </ul>
          <p className="text-primary-700 mb-6">
            We affirm the doctrines of grace as articulated in the historic Reformed confessions, 
            including the Westminster Standards, the Three Forms of Unity, and the 1689 London 
            Baptist Confession of Faith.
          </p>
          
          <blockquote className="border-l-4 border-accent pl-4 italic my-8 text-primary-600">
            "For from him and through him and to him are all things. To him be glory forever. Amen."
            <br />— Romans 11:36
          </blockquote>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 border border-primary-200">
          <h2 className="text-2xl font-bold mb-4">About the Author</h2>
          <div className="md:flex items-start gap-6">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <div className="bg-primary-200 h-64 w-full rounded-md mb-4 flex items-center justify-center text-primary-500">
                [Author Photo]
              </div>
            </div>
            <div className="md:w-2/3">
              <p className="text-primary-700 mb-4">
                [Insert author bio here. Share your background, education, ministry experience, 
                and what led you to start this blog. Discuss your passion for Reformed theology 
                and your goals for this website.]
              </p>
              <p className="text-primary-700">
                Feel free to reach out through the contact form or connect on social media.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;