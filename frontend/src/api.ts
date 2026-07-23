import { createApi } from './lib/http';
import type {
  AuthorPage, AuthorSummary, CommentView, MeInfo, PostDetail, PostSummary, TagCount,
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
export const getTags = () => api.get<TagCount[]>('/tags');
export const getAuthors = () => api.get<AuthorSummary[]>('/authors');
export const getAuthor = (name: string) => api.get<AuthorPage>(`/authors/${encodeURIComponent(name)}`);

// ---- comments / subscriptions ----
export const getComments = (postId: string) =>
  api.get<CommentView[]>(`/comments?postId=${encodeURIComponent(postId)}`);

export const postComment = (input: { postId: string; name: string; email: string; comment: string }) =>
  api.post<CommentView>('/comments', input);

export const subscribe = (email: string) => api.post<void>('/subscriptions', { email });
