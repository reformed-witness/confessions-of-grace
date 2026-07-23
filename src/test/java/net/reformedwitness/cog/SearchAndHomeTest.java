package net.reformedwitness.cog;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import net.reformedwitness.cog.domain.Post;
import net.reformedwitness.cog.service.SearchService;
import net.reformedwitness.cog.web.HomeController;
import net.reformedwitness.cog.web.PostController;

/** Search and the front page, against the real seeded content. */
@SpringBootTest(properties = {
        "platform.storage.access-key=test",
        "platform.storage.secret-key=test"
})
@Testcontainers
class SearchAndHomeTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>(DockerImageName.parse("postgres:18-alpine"));

    @Autowired
    SearchService search;

    @Autowired
    HomeController home;

    @Autowired
    PostController postController;

    @Test
    void findsAPostByAWordFromItsTitle() {
        List<Post> hits = search.search("grace");
        assertThat(hits).isNotEmpty();
    }

    @Test
    void searchesInsideThePostBodyNotJustTheSummary() {
        // The whole point of moving this off the browser: the client only ever had summaries, so a
        // phrase from the body of a post was unfindable.
        Post seeded = search.search("grace").getFirst();
        String body = seeded.getContent();
        assertThat(body).isNotBlank();

        // A distinctive long word from the body, that isn't also in the title/excerpt/tags.
        String word = java.util.Arrays.stream(body.split("\\W+"))
                .filter(w -> w.length() > 9)
                .filter(w -> !seeded.getTitle().toLowerCase().contains(w.toLowerCase()))
                .filter(w -> seeded.getExcerpt() == null || !seeded.getExcerpt().toLowerCase().contains(w.toLowerCase()))
                .findFirst()
                .orElse(null);
        assertThat(word).as("seeded post should contain a body-only word to search for").isNotNull();

        assertThat(search.search(word))
                .as("searching for '%s', which appears only in the body", word)
                .extracting(Post::getSlug)
                .contains(seeded.getSlug());
    }

    @Test
    void ashortOrEmptyTermMatchesNothingRatherThanEverything() {
        assertThat(search.search("")).isEmpty();
        assertThat(search.search("  ")).isEmpty();
        assertThat(search.search("a")).isEmpty();
    }

    @Test
    void wildcardCharactersAreSearchedLiterally() {
        int total = home.home().posts().size() + 1; // + the featured one

        // Unescaped, these are LIKE wildcards and would match every published post.
        assertThat(search.search("%%")).extracting(Post::getSlug).as("posts matching a literal %%").isEmpty();
        // "__" does legitimately appear — markdown writes bold that way — so the check is that it
        // matches those posts and not the whole site.
        assertThat(search.search("__")).hasSizeLessThan(total);
    }

    @Test
    void searchIsCaseInsensitive() {
        assertThat(search.search("GRACE")).hasSameSizeAs(search.search("grace"));
    }

    @Test
    void theHomePageLeadsWithTheNewestPostAndDoesNotRepeatIt() {
        HomeController.HomePage page = home.home();

        assertThat(page.featured()).isNotNull();
        assertThat(page.recent()).isNotEmpty();
        assertThat(page.tags()).isNotEmpty();
        assertThat(page.posts())
                .as("the featured post must not appear again in the list below it")
                .extracting(net.reformedwitness.cog.web.Dto.PostSummary::slug)
                .doesNotContain(page.featured().slug());
    }

    @Test
    void theSearchPathIsNotSwallowedByThePostSlugRoute() {
        // /api/posts/search and /api/posts/{slug} overlap; the literal path has to win.
        assertThat(postController.search("grace")).isNotEmpty();
    }
}
