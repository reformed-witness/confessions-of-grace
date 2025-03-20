import Head from 'next/head';
import React, { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import { Analytics } from "@vercel/analytics/react"

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Confessions of Grace', 
  description = 'A blog dedicated to exploring the doctrines of grace and Reformed theology.'
}) => {
  return (
    <html lang="en">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
      <Analytics />
    </html>
  );
};

export default Layout;