export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">About</h1>

      <div className="mb-10 rounded-lg border border-primary-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">Confessions of Grace</h2>
        <p className="mb-6 text-primary-700">
          Welcome to Confessions of Grace, a blog dedicated to exploring the riches of Reformed theology and the
          doctrines of grace. Our aim is to articulate timeless biblical truths in a clear, accessible manner,
          helping believers understand the depth and beauty of God&apos;s sovereign grace.
        </p>

        <h2 className="mb-4 text-2xl font-bold">What Do You Mean By &ldquo;Confessions of Grace&rdquo;?</h2>
        <p className="mb-6 text-primary-700">
          The name &ldquo;Confessions of Grace&rdquo; is a play on Augustine&apos;s &ldquo;Confessions&rdquo; and John
          Bunyan&apos;s &ldquo;Grace Abounding to the Chief of Sinners.&rdquo; I originally wanted to call the blog
          &ldquo;Confessions of the Chief of Sinners,&rdquo; but that felt a bit too long. The idea behind those books
          is that we are all sinners saved by grace, needing to confess that grace to others. &ldquo;Confessions of
          Grace&rdquo; seems to fit that idea well.
        </p>

        <h3 className="mb-3 text-xl font-bold">Our Vision</h3>
        <p className="mb-6 text-primary-700">
          In an age of theological confusion and spiritual relativism, we seek to provide content that is firmly
          rooted in Scripture, historically informed, and pastorally sensitive. We believe that sound doctrine leads
          to doxology—that theology, properly understood, results in worship and wonder at the character and works
          of God.
        </p>

        <h3 className="mb-3 text-xl font-bold">What We Believe</h3>
        <p className="mb-6 text-primary-700">
          We stand in the tradition of the Protestant Reformation, affirming the five &ldquo;solas&rdquo;:
        </p>
        <ul className="mb-6 list-inside list-disc space-y-2 text-primary-700">
          <li><span className="font-semibold italic">Sola Scriptura</span> — Scripture Alone</li>
          <li><span className="font-semibold italic">Sola Fide</span> — Faith Alone</li>
          <li><span className="font-semibold italic">Sola Gratia</span> — Grace Alone</li>
          <li><span className="font-semibold italic">Solus Christus</span> — Christ Alone</li>
          <li><span className="font-semibold italic">Soli Deo Gloria</span> — Glory to God Alone</li>
        </ul>
        <p className="mb-6 text-primary-700">
          As Reformed Baptists, we affirm the doctrines of grace as articulated in the 1689 London Baptist Confession
          of Faith. This historic confession provides a robust and faithful summary of biblical doctrine, emphasizing
          God&apos;s sovereignty in salvation and the centrality of Christ in all things.
        </p>

        <h3 className="mb-3 text-xl font-bold">Our Associations</h3>
        <p className="mb-6 text-primary-700">
          We are associated with the{' '}
          <a href="https://reformedwitness.net" className="text-accent hover:text-accent-dark">
            Reformed Witness Network (RWN)
          </a>
          , a group committed to the proclamation of the gospel and the advancement of Christ&apos;s kingdom. Through
          RWN, we aim to foster fellowship among like-minded believers and support the spread of Reformed theology
          globally.
        </p>

        <blockquote className="my-8 border-l-4 border-accent pl-4 italic text-primary-600">
          &ldquo;For from him and through him and to him are all things. To him be glory forever. Amen.&rdquo;
          <br />— Romans 11:36
        </blockquote>
      </div>

      <div className="rounded-lg border border-primary-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">About the Author</h2>
        <div className="items-start gap-6 md:flex">
          <div className="md:w-2/3">
            <p className="mb-4 text-primary-700">
              My wife and I are members of Covenant Community Church, where I have been blessed to grow in faith and
              fellowship. My passion for theology and technology inspired me to start this blog as a way to share the
              beauty of God&apos;s sovereign grace. I hope to one day reach unreached people groups and share the
              gospel with them.
            </p>
            <p className="text-primary-700">
              Feel free to connect with me on X @auggie2lbcf or email me at contact@confessionsofgrace.com. I would
              love to hear from you and learn how I can serve you better.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
