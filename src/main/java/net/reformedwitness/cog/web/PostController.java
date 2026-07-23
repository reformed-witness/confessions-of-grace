package net.reformedwitness.cog.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import net.reformedwitness.cog.domain.Post;
import net.reformedwitness.cog.repo.PostRepository;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository posts;

    public PostController(PostRepository posts) {
        this.posts = posts;
    }

    @GetMapping
    public List<Dto.PostSummary> list(@RequestParam(required = false) String tag,
                                      @RequestParam(required = false) String author) {
        List<Post> result;
        if (tag != null && !tag.isBlank()) {
            result = posts.findPublishedByTag(tag);
        } else if (author != null && !author.isBlank()) {
            result = posts.findByPublishedTrueAndAuthorOrderByPublishedOnDescIdDesc(author);
        } else {
            result = posts.findByPublishedTrueOrderByPublishedOnDescIdDesc();
        }
        return result.stream().map(Dto::summary).toList();
    }

    @GetMapping("/{slug}")
    public Dto.PostDetail get(@PathVariable String slug) {
        Post p = posts.findBySlug(slug)
                .filter(Post::isPublished)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "post not found"));
        return Dto.detail(p);
    }
}
