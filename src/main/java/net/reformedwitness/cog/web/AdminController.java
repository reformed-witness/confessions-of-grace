package net.reformedwitness.cog.web;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import net.reformedwitness.cog.domain.Author;
import net.reformedwitness.cog.domain.Post;
import net.reformedwitness.cog.repo.AuthorRepository;
import net.reformedwitness.cog.repo.CommentRepository;
import net.reformedwitness.cog.repo.PostRepository;
import net.reformedwitness.cog.service.MarkdownService;

/** Admin API — requires an Authentik login (not in security permit-paths). */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PostRepository posts;
    private final CommentRepository comments;
    private final AuthorRepository authors;
    private final MarkdownService markdown;

    public AdminController(PostRepository posts, CommentRepository comments, AuthorRepository authors,
                           MarkdownService markdown) {
        this.posts = posts;
        this.comments = comments;
        this.authors = authors;
        this.markdown = markdown;
    }

    @PostMapping("/posts")
    @ResponseStatus(HttpStatus.CREATED)
    public Dto.PostDetail create(@RequestBody Dto.PostRequest req) {
        if (req.slug() == null || req.slug().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "slug required");
        }
        if (posts.existsBySlug(req.slug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "slug already exists");
        }
        return Dto.detail(save(new Post(), req));
    }

    @PutMapping("/posts/{slug}")
    public Dto.PostDetail update(@PathVariable String slug, @RequestBody Dto.PostRequest req) {
        Post p = posts.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "post not found"));
        return Dto.detail(save(p, req));
    }

    @DeleteMapping("/posts/{slug}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable String slug) {
        Post p = posts.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "post not found"));
        posts.delete(p);
    }

    @DeleteMapping("/comments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable Long id) {
        comments.deleteById(id);
    }

    private Post save(Post p, Dto.PostRequest req) {
        p.setSlug(req.slug());
        p.setTitle(req.title() != null ? req.title() : req.slug());
        p.setPublishedOn(req.date() != null && !req.date().isBlank() ? LocalDate.parse(req.date()) : LocalDate.now());
        p.setExcerpt(req.excerpt() != null ? req.excerpt() : "");
        p.setAuthor(req.author() != null ? req.author() : "");
        p.setCoverImage(req.coverImage());
        p.setTags(req.tags() != null ? req.tags() : List.of());
        p.setContent(req.content() != null ? req.content() : "");
        p.setContentHtml(markdown.toHtml(req.content()));
        p.setPublished(req.published() == null || req.published());
        if (!p.getAuthor().isBlank() && authors.findByName(p.getAuthor()).isEmpty()) {
            Author a = new Author();
            a.setName(p.getAuthor());
            authors.save(a);
        }
        return posts.save(p);
    }
}
