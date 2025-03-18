# Confessions of Grace

A blog about Reformed theology built with Next.js and TypeScript, featuring Markdown-based content management.

## Features

- Modern static site built with Next.js
- TypeScript for type safety
- Content management using Markdown files
- Responsive design with Tailwind CSS
- Flat design style with Reformed theology aesthetics

## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/confessions-of-grace.git
cd confessions-of-grace
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
├── public/               # Static assets
│   └── images/           # Images for blog posts
├── src/                  # Source code
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   ├── pages/            # Next.js pages
│   ├── posts/            # Markdown blog posts
│   ├── styles/           # CSS styles
│   └── types/            # TypeScript type definitions
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Writing Blog Posts

To add a new blog post, create a new Markdown file in the `src/posts` directory with the following format:

```markdown
---
title: "Your Post Title"
date: "YYYY-MM-DD"
author: "Your Name"
excerpt: "A brief excerpt of your post"
tags: ["Tag1", "Tag2"]
coverImage: "/images/your-image.jpg"
---

# Your Post Title

Your content goes here...
```

## Deployment

The site can be deployed to various platforms:

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Standard Build

```bash
npm run build
npm start
```

## Customization

- Modify the design in `tailwind.config.js` and `src/styles/globals.css`
- Update site content in component files
- Add or modify pages in the `src/pages` directory

## License

This project is licensed under the MIT License.