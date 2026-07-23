package net.reformedwitness.cog.web;

import java.util.List;

import net.reformedwitness.cog.domain.Post;

/** Request/response shapes for the API. */
public final class Dto {

    private Dto() {
    }

    public record PostSummary(String slug, String title, String date, String excerpt, String author,
                              List<String> tags, String coverImage) {
    }

    public record PostDetail(String slug, String title, String date, String excerpt, String author,
                             List<String> tags, String coverImage, String contentHtml) {
    }

    public record AuthorSummary(String name, String bio, String pfpLink, int postCount) {
    }

    public record AuthorPage(String name, String bio, String xLink, String fbLink, String instaLink,
                             String pfpLink, int postCount, List<PostSummary> posts) {
    }

    public record CommentView(Long id, String name, String body, String createdAt) {
    }

    public record TagCount(String tag, long count) {
    }

    public record CommentRequest(String postId, String name, String email, String comment) {
    }

    public record SubscribeRequest(String email) {
    }

    public record MeInfo(boolean authenticated, boolean admin, String owner) {
    }

    public record PostRequest(String slug, String title, String date, String excerpt, String author,
                              List<String> tags, String coverImage, String content, Boolean published) {
    }

    // ---- admin-only shapes ----

    /** Editing view: carries the RAW markdown and the draft flag (the public detail only has HTML). */
    public record PostEdit(String slug, String title, String date, String excerpt, String author,
                           List<String> tags, String coverImage, String content, boolean published) {
    }

    /** Moderation view: includes the post and the commenter's email, which the public view omits. */
    public record AdminComment(Long id, String postSlug, String name, String email, String body,
                               String createdAt) {
    }

    public record AuthorRequest(String bio, String xLink, String fbLink, String instaLink, String pfpLink) {
    }

    /** Presigned upload target: PUT the file to {@code uploadUrl}, then store {@code publicUrl}. */
    public record UploadTarget(String key, String uploadUrl, String publicUrl) {
    }

    public static PostSummary summary(Post p) {
        return new PostSummary(p.getSlug(), p.getTitle(), p.getPublishedOn().toString(), p.getExcerpt(),
                p.getAuthor(), List.copyOf(p.getTags()), p.getCoverImage());
    }

    public static PostDetail detail(Post p) {
        return new PostDetail(p.getSlug(), p.getTitle(), p.getPublishedOn().toString(), p.getExcerpt(),
                p.getAuthor(), List.copyOf(p.getTags()), p.getCoverImage(), p.getContentHtml());
    }

    public static PostEdit edit(Post p) {
        return new PostEdit(p.getSlug(), p.getTitle(), p.getPublishedOn().toString(), p.getExcerpt(),
                p.getAuthor(), List.copyOf(p.getTags()), p.getCoverImage(), p.getContent(), p.isPublished());
    }
}
