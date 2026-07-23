package net.reformedwitness.cog.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import net.reformedwitness.cog.domain.Author;
import net.reformedwitness.cog.repo.AuthorRepository;
import net.reformedwitness.cog.repo.PostRepository;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorRepository authors;
    private final PostRepository posts;

    public AuthorController(AuthorRepository authors, PostRepository posts) {
        this.authors = authors;
        this.posts = posts;
    }

    @GetMapping
    public List<Dto.AuthorSummary> list() {
        return authors.findAllByOrderByNameAsc().stream()
                .map(a -> new Dto.AuthorSummary(a.getName(), a.getBio(), a.getPfpLink(),
                        posts.findByPublishedTrueAndAuthorOrderByPublishedOnDescIdDesc(a.getName()).size()))
                .toList();
    }

    @GetMapping("/{name}")
    public Dto.AuthorPage get(@PathVariable String name) {
        Author a = authors.findByName(name)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "author not found"));
        List<Dto.PostSummary> authored = posts.findByPublishedTrueAndAuthorOrderByPublishedOnDescIdDesc(name)
                .stream().map(Dto::summary).toList();
        return new Dto.AuthorPage(a.getName(), a.getBio(), a.getXLink(), a.getFbLink(), a.getInstaLink(),
                a.getPfpLink(), authored.size(), authored);
    }
}
