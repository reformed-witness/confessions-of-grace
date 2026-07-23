package net.reformedwitness.cog.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import net.thebennett.platform.data.BaseEntity;

@Entity
@Table(name = "post")
public class Post extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String excerpt = "";

    private String author = "";

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "published_on", nullable = false)
    private LocalDate publishedOn;

    @Column(columnDefinition = "text")
    private String content = "";

    @Column(name = "content_html", columnDefinition = "text")
    private String contentHtml = "";

    private boolean published = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
    public LocalDate getPublishedOn() { return publishedOn; }
    public void setPublishedOn(LocalDate publishedOn) { this.publishedOn = publishedOn; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getContentHtml() { return contentHtml; }
    public void setContentHtml(String contentHtml) { this.contentHtml = contentHtml; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
