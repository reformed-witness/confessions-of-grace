package net.reformedwitness.cog.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.reformedwitness.cog.domain.Post;
import net.reformedwitness.cog.repo.PostRepository;

/**
 * Site search.
 *
 * <p>This used to be done in the browser: every visitor downloaded the whole post list and filtered
 * it with {@code String.includes}. That could only ever match what the summary carried — title,
 * excerpt, author, tags — so searching for a phrase from the body of a post found nothing, and the
 * cost grew with every post published.
 */
@Service
public class SearchService {

    /** Below this a search matches most of the site; treat it as no search at all. */
    private static final int MIN_TERM_LENGTH = 2;

    private final PostRepository posts;

    public SearchService(PostRepository posts) {
        this.posts = posts;
    }

    @Transactional(readOnly = true)
    public List<Post> search(String query) {
        String term = query == null ? "" : query.trim();
        if (term.length() < MIN_TERM_LENGTH) {
            return List.of();
        }
        return posts.search("%" + escapeLike(term.toLowerCase()) + "%");
    }

    /**
     * A search for "100%" must look for a literal percent sign, not "anything".
     *
     * <p>Uses '#' with an explicit {@code ESCAPE} clause on the query rather than the backslash you'd
     * expect: LIKE has no default escape character to rely on here, and the posts are markdown, which
     * is full of literal backslashes — escaping with one turned a search for "%" into a search for
     * backslashes and matched unrelated posts.
     */
    private static String escapeLike(String raw) {
        // The escape character itself first, or the escapes below get double-escaped.
        return raw.replace("#", "##").replace("%", "#%").replace("_", "#_");
    }
}
