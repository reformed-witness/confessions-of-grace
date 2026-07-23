package net.reformedwitness.cog.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import net.reformedwitness.cog.domain.Comment;
import net.reformedwitness.cog.repo.CommentRepository;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentRepository comments;

    public CommentController(CommentRepository comments) {
        this.comments = comments;
    }

    /** Public list for a post (email is never exposed). */
    @GetMapping
    public List<Dto.CommentView> list(@RequestParam("postId") String postSlug) {
        return comments.findByPostSlugOrderByCreatedAtAsc(postSlug).stream()
                .map(c -> new Dto.CommentView(c.getId(), c.getName(), c.getBody(),
                        c.getCreatedAt() != null ? c.getCreatedAt().toString() : null))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Dto.CommentView create(@RequestBody Dto.CommentRequest req) {
        if (blank(req.postId()) || blank(req.name()) || blank(req.email()) || blank(req.comment())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "postId, name, email, comment are required");
        }
        Comment c = new Comment();
        c.setPostSlug(req.postId().trim());
        c.setName(req.name().trim());
        c.setEmail(req.email().trim());
        c.setBody(req.comment().trim());
        comments.save(c);
        return new Dto.CommentView(c.getId(), c.getName(), c.getBody(),
                c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }
}
