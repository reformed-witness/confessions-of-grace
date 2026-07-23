package net.reformedwitness.cog.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import net.reformedwitness.cog.domain.Author;
import net.reformedwitness.cog.domain.Post;
import net.reformedwitness.cog.repo.AuthorRepository;
import net.reformedwitness.cog.repo.PostRepository;

/** On first run (empty DB), seeds posts from the bundled markdown and derives authors from them. */
@Component
public class ContentSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ContentSeeder.class);

    private final PostRepository posts;
    private final AuthorRepository authors;
    private final MarkdownService markdown;
    private final ResourcePatternResolver resolver;

    public ContentSeeder(PostRepository posts, AuthorRepository authors, MarkdownService markdown, ResourceLoader rl) {
        this.posts = posts;
        this.authors = authors;
        this.markdown = markdown;
        this.resolver = ResourcePatternUtils.getResourcePatternResolver(rl);
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        if (posts.count() > 0) {
            return;
        }
        Resource[] files = resolver.getResources("classpath:seed/posts/*.md");
        Set<String> authorNames = new LinkedHashSet<>();
        for (Resource file : files) {
            String name = file.getFilename();
            if (name == null) {
                continue;
            }
            String slug = name.replaceAll("\\.md$", "");
            String raw = new String(file.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            var rendered = markdown.render(raw);
            Map<String, List<String>> fm = rendered.frontMatter();

            Post p = new Post();
            p.setSlug(slug);
            p.setTitle(first(fm, "title", slug));
            p.setPublishedOn(parseDate(first(fm, "date", "2020-01-01")));
            p.setExcerpt(first(fm, "excerpt", ""));
            p.setAuthor(first(fm, "author", ""));
            p.setCoverImage(firstOrNull(fm, "coverImage"));
            p.setTags(parseTags(fm));
            p.setContent(stripFrontMatter(raw));
            p.setContentHtml(rendered.html());
            p.setPublished(true);
            posts.save(p);
            if (!p.getAuthor().isBlank()) {
                authorNames.add(p.getAuthor());
            }
        }
        for (String authorName : authorNames) {
            if (authors.findByName(authorName).isEmpty()) {
                Author a = new Author();
                a.setName(authorName);
                authors.save(a);
            }
        }
        log.info("Seeded {} posts, {} authors", posts.count(), authorNames.size());
    }

    private static String first(Map<String, List<String>> fm, String key, String def) {
        List<String> v = fm.get(key);
        return (v != null && !v.isEmpty()) ? unquote(v.get(0)) : def;
    }

    private static String firstOrNull(Map<String, List<String>> fm, String key) {
        List<String> v = fm.get(key);
        return (v != null && !v.isEmpty()) ? unquote(v.get(0)) : null;
    }

    /** Strip surrounding single/double quotes left by the front-matter parser. */
    private static String unquote(String s) {
        String t = s == null ? "" : s.trim();
        if (t.length() >= 2
                && ((t.startsWith("\"") && t.endsWith("\"")) || (t.startsWith("'") && t.endsWith("'")))) {
            t = t.substring(1, t.length() - 1);
        }
        return t.trim();
    }

    /**
     * The front-matter parser doesn't split inline flow arrays, so {@code tags: ["a", "b"]} arrives as one
     * string. Handle both that and normal block lists, and cap length to the column width.
     */
    private static List<String> parseTags(Map<String, List<String>> fm) {
        List<String> out = new ArrayList<>();
        for (String value : fm.getOrDefault("tags", List.of())) {
            String s = value == null ? "" : value.trim();
            if (s.startsWith("[") && s.endsWith("]")) {
                s = s.substring(1, s.length() - 1);
                for (String part : s.split(",")) {
                    addTag(out, part);
                }
            } else {
                addTag(out, s);
            }
        }
        return out;
    }

    private static void addTag(List<String> out, String raw) {
        String tag = unquote(raw);
        if (!tag.isEmpty() && tag.length() <= 80 && !out.contains(tag)) {
            out.add(tag);
        }
    }

    private static LocalDate parseDate(String s) {
        try {
            return LocalDate.parse(s);
        } catch (Exception e) {
            return LocalDate.of(2020, 1, 1);
        }
    }

    private static String stripFrontMatter(String raw) {
        if (raw.startsWith("---")) {
            int end = raw.indexOf("\n---", 3);
            if (end >= 0) {
                int nl = raw.indexOf('\n', end + 1);
                return nl >= 0 ? raw.substring(nl + 1).stripLeading() : "";
            }
        }
        return raw;
    }
}
