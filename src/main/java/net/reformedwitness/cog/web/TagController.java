package net.reformedwitness.cog.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.reformedwitness.cog.service.TagService;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tags;

    public TagController(TagService tags) {
        this.tags = tags;
    }

    /** All tags used by published posts, with counts. */
    @GetMapping
    public List<Dto.TagCount> list() {
        return tags.counts().stream().map(t -> new Dto.TagCount(t.tag(), t.count())).toList();
    }
}
