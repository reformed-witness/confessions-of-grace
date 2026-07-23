package net.reformedwitness.cog.web;

import java.util.List;

import org.springframework.data.domain.Limit;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import net.reformedwitness.cog.domain.Post;
import net.reformedwitness.cog.repo.PostRepository;
import net.reformedwitness.cog.service.TagService;

/**
 * Everything the front page needs, in one call.
 *
 * <p>Which post is "the latest" was previously decided in the browser by taking element zero of the
 * list — correct only for as long as the API happened to return posts in that order, and invisible
 * from the backend if it ever changed. It's a decision, so it's made here.
 */
@RestController
public class HomeController {

    /** How many posts the sidebar lists. */
    private static final Limit RECENT = Limit.of(5);

    private final PostRepository posts;
    private final TagService tags;

    public HomeController(PostRepository posts, TagService tags) {
        this.posts = posts;
        this.tags = tags;
    }

    /**
     * @param featured the post to lead with, null when nothing is published yet
     * @param posts    the rest of the published posts, newest first, excluding the featured one
     */
    public record HomePage(Dto.PostSummary featured, List<Dto.PostSummary> posts,
                           List<Dto.PostSummary> recent, List<Dto.TagCount> tags) {}

    @GetMapping("/api/home")
    public HomePage home() {
        List<Post> published = posts.findByPublishedTrueOrderByPublishedOnDescIdDesc();
        Dto.PostSummary featured = published.isEmpty() ? null : Dto.summary(published.getFirst());
        List<Dto.PostSummary> rest = published.stream().skip(1).map(Dto::summary).toList();
        List<Dto.PostSummary> recent = posts.findByPublishedTrueOrderByPublishedOnDescIdDesc(RECENT)
                .stream().map(Dto::summary).toList();
        return new HomePage(featured, rest, recent,
                tags.counts().stream().map(t -> new Dto.TagCount(t.tag(), t.count())).toList());
    }
}
