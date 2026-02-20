"use client";

import { useState } from "react";

interface PostEditorProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    author: string;
    tags: string[];
    coverImage?: string | null;
    published: boolean;
  };
  authors: { name: string }[];
  isEdit?: boolean;
}

export default function PostEditor({
  action,
  initialData,
  authors,
  isEdit = false,
}: PostEditorProps) {
  const [content, setContent] = useState(initialData?.content || "");
  const [published, setPublished] = useState(
    initialData?.published ?? false
  );

  return (
    <form action={action} className="space-y-6">
      {/* Slug / ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug (URL ID)
        </label>
        <input
          type="text"
          name="id"
          defaultValue={initialData?.id || ""}
          readOnly={isEdit}
          required
          placeholder="my-post-slug"
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${isEdit ? "bg-gray-100" : ""}`}
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={initialData?.title || ""}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          defaultValue={
            initialData?.date
              ? new Date(initialData.date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Author
        </label>
        <select
          name="author"
          defaultValue={initialData?.author || ""}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Select an author</option>
          {authors.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={initialData?.excerpt || ""}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          name="tags"
          defaultValue={initialData?.tags?.join(", ") || ""}
          placeholder="theology, books, personal life"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Image URL
        </label>
        <input
          type="text"
          name="coverImage"
          defaultValue={initialData?.coverImage || ""}
          placeholder="/images/my-post.png"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Content (Markdown) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content (Markdown)
        </label>
        <textarea
          name="content"
          rows={20}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Published Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="hidden"
          name="published"
          value={published ? "true" : "false"}
        />
        <button
          type="button"
          onClick={() => setPublished(!published)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            published ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              published ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-sm text-gray-700">
          {published ? "Published" : "Draft"}
        </span>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-accent text-white px-6 py-2 rounded-md hover:bg-accent-dark"
        >
          {isEdit ? "Update Post" : "Create Post"}
        </button>
        <a
          href="/admin/posts"
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
