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

    public static PostSummary summary(Post p) {
        return new PostSummary(p.getSlug(), p.getTitle(), p.getPublishedOn().toString(), p.getExcerpt(),
                p.getAuthor(), List.copyOf(p.getTags()), p.getCoverImage());
    }

    public static PostDetail detail(Post p) {
        return new PostDetail(p.getSlug(), p.getTitle(), p.getPublishedOn().toString(), p.getExcerpt(),
                p.getAuthor(), List.copyOf(p.getTags()), p.getCoverImage(), p.getContentHtml());
    }
}
