package net.reformedwitness.cog;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import net.reformedwitness.cog.repo.AuthorRepository;
import net.reformedwitness.cog.repo.PostRepository;

/**
 * Full-context test against a real Postgres: proves the Flyway schema, the JPA mappings, and the markdown
 * seeding (front-matter parsing + HTML rendering) all work end to end.
 */
@SpringBootTest(properties = {
        "platform.storage.access-key=test",
        "platform.storage.secret-key=test"
})
@Testcontainers
class ConfessionsApplicationTests {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>(DockerImageName.parse("postgres:18-alpine"));

    @Autowired
    PostRepository posts;

    @Autowired
    AuthorRepository authors;

    @Test
    void seedsPostsAndAuthorsFromBundledMarkdown() {
        assertThat(posts.findByPublishedTrueOrderByPublishedOnDescIdDesc()).isNotEmpty();
        assertThat(authors.findAllByOrderByNameAsc()).isNotEmpty();

        var fourfold = posts.findBySlug("fourfold");
        assertThat(fourfold).isPresent();
        assertThat(fourfold.get().getTitle()).isNotBlank();
        assertThat(fourfold.get().getAuthor()).isNotBlank();
        assertThat(fourfold.get().getTags()).isNotEmpty();
        assertThat(fourfold.get().getContentHtml()).contains("<p>");
    }

    @Test
    void tagCountsAreAggregated() {
        assertThat(posts.tagCounts()).isNotEmpty();
    }
}
