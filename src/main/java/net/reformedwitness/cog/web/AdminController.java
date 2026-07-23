package net.reformedwitness.cog.web;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import net.reformedwitness.cog.domain.Author;
import net.reformedwitness.cog.domain.Post;
import net.reformedwitness.cog.domain.Subscription;
import net.reformedwitness.cog.repo.AuthorRepository;
import net.reformedwitness.cog.repo.CommentRepository;
import net.reformedwitness.cog.repo.PostRepository;
import net.reformedwitness.cog.repo.SubscriptionRepository;
import net.reformedwitness.cog.service.MarkdownService;
import net.thebennett.platform.storage.StorageService;

/** Admin API — requires an Authentik login (see platform.security.authenticated-paths). */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PostRepository posts;
    private final CommentRepository comments;
    private final AuthorRepository authors;
    private final SubscriptionRepository subscriptions;
    private final MarkdownService markdown;
    private final StorageService storage;
    private final String bucket;
    private final String s3Endpoint;

    public AdminController(PostRepository posts, CommentRepository comments, AuthorRepository authors,
                           SubscriptionRepository subscriptions, MarkdownService markdown, StorageService storage,
                           @Value("${bennett.storage.bucket}") String bucket,
                           @Value("${platform.storage.endpoint}") String s3Endpoint) {
        this.posts = posts;
        this.comments = comments;
        this.authors = authors;
        this.subscriptions = subscriptions;
        this.markdown = markdown;
        this.storage = storage;
        this.bucket = bucket;
        this.s3Endpoint = s3Endpoint.replaceAll("/+$", "");
    }

    // ---- posts ----

    /** All posts, including unpublished drafts. */
    @GetMapping("/posts")
    public List<Dto.PostEdit> listAll() {
        return posts.findAllByOrderByPublishedOnDescIdDesc().stream().map(Dto::edit).toList();
    }

    /** One post with its raw markdown, for editing. */
    @GetMapping("/posts/{slug}")
    public Dto.PostEdit getForEdit(@PathVariable String slug) {
        return Dto.edit(posts.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "post not found")));
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

    // ---- images (MinIO) ----

    /**
     * Mint a presigned PUT so the browser uploads straight to MinIO, and return the stable public URL to
     * store as the post's cover image (the bucket is public-read for these).
     */
    @PostMapping("/images/presign-upload")
    public Dto.UploadTarget presignUpload(@RequestParam String filename,
                                          @RequestParam(defaultValue = "application/octet-stream") String contentType) {
        String safe = filename.toLowerCase().replaceAll("[^a-z0-9._-]", "-");
        String key = "images/" + UUID.randomUUID() + "-" + safe;
        String uploadUrl = storage.presignPut(bucket, key, contentType).toString();
        return new Dto.UploadTarget(key, uploadUrl, s3Endpoint + "/" + bucket + "/" + key);
    }

    // ---- comments / subscribers / authors ----

    @GetMapping("/comments")
    public List<Dto.AdminComment> allComments() {
        return comments.findAllByOrderByCreatedAtDesc().stream()
                .map(c -> new Dto.AdminComment(c.getId(), c.getPostSlug(), c.getName(), c.getEmail(), c.getBody(),
                        c.getCreatedAt() != null ? c.getCreatedAt().toString() : null))
                .toList();
    }

    @DeleteMapping("/comments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable Long id) {
        comments.deleteById(id);
    }

    @GetMapping("/subscriptions")
    public List<String> subscribers() {
        return subscriptions.findAllByOrderByCreatedAtDesc().stream().map(Subscription::getEmail).toList();
    }

    @PutMapping("/authors/{name}")
    public Dto.AuthorSummary upsertAuthor(@PathVariable String name, @RequestBody Dto.AuthorRequest req) {
        Author a = authors.findByName(name).orElseGet(() -> {
            Author created = new Author();
            created.setName(name);
            return created;
        });
        a.setBio(req.bio() != null ? req.bio() : "");
        a.setXLink(req.xLink());
        a.setFbLink(req.fbLink());
        a.setInstaLink(req.instaLink());
        a.setPfpLink(req.pfpLink());
        authors.save(a);
        int count = posts.findByPublishedTrueAndAuthorOrderByPublishedOnDescIdDesc(name).size();
        return new Dto.AuthorSummary(a.getName(), a.getBio(), a.getPfpLink(), count);
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
