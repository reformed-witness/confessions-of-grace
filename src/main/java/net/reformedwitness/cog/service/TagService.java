package net.reformedwitness.cog.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.reformedwitness.cog.repo.PostRepository;

/** Tag counts across published posts — used by the tag page and by the home sidebar. */
@Service
public class TagService {

    /** tag -> how many published posts carry it. */
    public record TagCount(String tag, long count) {}

    private final PostRepository posts;

    public TagService(PostRepository posts) {
        this.posts = posts;
    }

    @Transactional(readOnly = true)
    public List<TagCount> counts() {
        return posts.tagCounts().stream()
                .map(row -> new TagCount((String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }
}
