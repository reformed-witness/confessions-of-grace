import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const postsDirectory = path.join(process.cwd(), "data/posts");

async function migratePost(fileName: string) {
  const id = fileName.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  // Render markdown to HTML
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const post = {
    id,
    title: matterResult.data.title || "",
    date: new Date(matterResult.data.date).toISOString(),
    excerpt: matterResult.data.excerpt || "",
    content: matterResult.content, // raw markdown
    content_html: contentHtml,
    author: matterResult.data.author || "",
    tags: matterResult.data.tags || [],
    cover_image: matterResult.data.coverImage || null,
    published: true,
  };

  const { error } = await supabase.from("posts").upsert(post, {
    onConflict: "id",
  });

  if (error) {
    console.error(`Failed to upsert post "${id}":`, error.message);
  } else {
    console.log(`Migrated: ${id}`);
  }
}

async function main() {
  console.log("Starting post migration...\n");

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"));

  console.log(`Found ${fileNames.length} markdown files.\n`);

  for (const fileName of fileNames) {
    await migratePost(fileName);
  }

  console.log("\nMigration complete!");
}

main().catch(console.error);
