import React from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';

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

          <h2 className="text-2xl font-bold mb-4">What Do You Mean By "Confessions of Grace"?</h2>
          <p className="text-primary-700 mb-6">
            The name "Confessions of Grace" is a play on Augustine's "Confessions" and John Bunyan's "Grace Abounding to the Chief of Sinners."
            I originally wanted to call the blog "Confessions of the Chief of Sinners," but that felt a bit too long.
            The idea behind those books is that we are all sinners saved by grace, needing to confess that grace to others.
            "Confessions of Grace" seems to fit that idea well.
          </p>
          
          <h3 className="text-xl font-bold mb-3">Our Vision</h3>
          <p className="text-primary-700 mb-6">
            In an age of theological confusion and spiritual relativism, we seek to provide content 
            that is firmly rooted in Scripture, historically informed, and pastorally sensitive. 
            We believe that sound doctrine leads to doxology—that theology, properly understood, 
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
            As Reformed Baptists, we affirm the doctrines of grace as articulated in the 1689 London 
            Baptist Confession of Faith. This historic confession provides a robust and faithful summary 
            of biblical doctrine, emphasizing God's sovereignty in salvation and the centrality of Christ 
            in all things.
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
              <div className="bg-primary-200 h-64 w-full rounded-md mb-4 relative h-48 w-full overflow-hidden rounded-md">
                <Image
                  src="/images/me.jpeg"
                  alt="Me"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <p className="text-primary-700 mb-4">
                My wife and I are members of Covenant Community Church,
                where I have been blessed to grow in faith and fellowship. My passion for theology and 
                technology inspired me to start this blog as a way to share the beauty of God's sovereign grace.
                I hope to one day reach unreached people groups and share the gospel with them.
              </p>
              <p className="text-primary-700">
                Feel free to connect with me on social media. If you are a brand, I only collaborate with Bubbl'r.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;