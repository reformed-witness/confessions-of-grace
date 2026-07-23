import { createApi } from './lib/http';
import type {
  AdminComment, AuthorPage, AuthorSummary, CommentView, MeInfo, PostDetail, PostEdit, PostSummary,
  TagCount, UploadTarget,
} from './types';

const api = createApi();

// ---- auth (public site: only /api/admin/** requires a login) ----
export const getMe = () => api.get<MeInfo>('/me');
export const login = () => api.login();
export const logout = () => api.logout();

// ---- posts / tags / authors ----
export function getPosts(params: { tag?: string; author?: string } = {}): Promise<PostSummary[]> {
  const qs = new URLSearchParams();
  if (params.tag) qs.set('tag', params.tag);
  if (params.author) qs.set('author', params.author);
  const q = qs.toString();
  return api.get<PostSummary[]>(`/posts${q ? `?${q}` : ''}`);
}
export const getPost = (slug: string) => api.get<PostDetail>(`/posts/${encodeURIComponent(slug)}`);

/** Searching is done by the database, over post bodies too — not by filtering a downloaded list. */
export const searchPosts = (q: string) =>
  api.get<PostSummary[]>(`/posts/search?q=${encodeURIComponent(q)}`);

export interface HomePage {
  featured: PostSummary | null;
  posts: PostSummary[];
  recent: PostSummary[];
  tags: TagCount[];
}
/** One call for the whole front page; which post leads is the backend's decision. */
export const getHome = () => api.get<HomePage>('/home');
export const getTags = () => api.get<TagCount[]>('/tags');
export const getAuthors = () => api.get<AuthorSummary[]>('/authors');
export const getAuthor = (name: string) => api.get<AuthorPage>(`/authors/${encodeURIComponent(name)}`);

// ---- comments / subscriptions ----
export const getComments = (postId: string) =>
  api.get<CommentView[]>(`/comments?postId=${encodeURIComponent(postId)}`);

export const postComment = (input: { postId: string; name: string; email: string; comment: string }) =>
  api.post<CommentView>('/comments', input);

export const subscribe = (email: string) => api.post<void>('/subscriptions', { email });

// ---- admin (requires an Authentik login) ----
export interface PostInput {
  slug: string; title: string; date: string; excerpt: string; author: string;
  tags: string[]; coverImage: string | null; content: string; published: boolean;
}

export const adminListPosts = () => api.get<PostEdit[]>('/admin/posts');
export const adminGetPost = (slug: string) => api.get<PostEdit>(`/admin/posts/${encodeURIComponent(slug)}`);
export const adminCreatePost = (body: PostInput) => api.post<PostDetail>('/admin/posts', body);
export const adminUpdatePost = (slug: string, body: PostInput) =>
  api.put<PostDetail>(`/admin/posts/${encodeURIComponent(slug)}`, body);
export const adminDeletePost = (slug: string) => api.del<void>(`/admin/posts/${encodeURIComponent(slug)}`);

export const adminListComments = () => api.get<AdminComment[]>('/admin/comments');
export const adminDeleteComment = (id: number) => api.del<void>(`/admin/comments/${id}`);
export const adminListSubscribers = () => api.get<string[]>('/admin/subscriptions');

/** Presign, PUT the file straight to MinIO, and return the public URL to store as the cover image. */
export async function adminUploadImage(file: File): Promise<string> {
  const type = file.type || 'application/octet-stream';
  const target = await api.post<UploadTarget>(
    `/admin/images/presign-upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(type)}`,
  );
  const put = await fetch(target.uploadUrl, { method: 'PUT', headers: { 'Content-Type': type }, body: file });
  if (!put.ok) throw new Error(`image upload failed: ${put.status}`);
  return target.publicUrl;
}
