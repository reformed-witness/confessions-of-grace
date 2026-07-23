package net.reformedwitness.cog.service;

import java.util.List;
import java.util.Map;

import org.commonmark.ext.front.matter.YamlFrontMatterExtension;
import org.commonmark.ext.front.matter.YamlFrontMatterVisitor;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.springframework.stereotype.Service;

/** Renders markdown (with optional YAML front matter) to HTML. */
@Service
public class MarkdownService {

    private final Parser parser;
    private final HtmlRenderer renderer;

    public MarkdownService() {
        var extensions = List.of(YamlFrontMatterExtension.create());
        this.parser = Parser.builder().extensions(extensions).build();
        this.renderer = HtmlRenderer.builder().extensions(extensions).build();
    }

    public record Rendered(Map<String, List<String>> frontMatter, String html) {
    }

    public Rendered render(String markdown) {
        Node document = parser.parse(markdown);
        var visitor = new YamlFrontMatterVisitor();
        document.accept(visitor);
        return new Rendered(visitor.getData(), renderer.render(document));
    }

    /** Render body-only markdown (no front matter expected) to HTML. */
    public String toHtml(String markdown) {
        return renderer.render(parser.parse(markdown == null ? "" : markdown));
    }
}
