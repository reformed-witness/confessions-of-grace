package net.reformedwitness.cog.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.reformedwitness.cog.repo.PostRepository;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final PostRepository posts;

    public TagController(PostRepository posts) {
        this.posts = posts;
    }

    /** All tags used by published posts, with counts. */
    @GetMapping
    public List<Dto.TagCount> list() {
        return posts.tagCounts().stream()
                .map(row -> new Dto.TagCount((String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }
}
