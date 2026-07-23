package net.reformedwitness.cog.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import net.thebennett.platform.data.BaseEntity;

@Entity
@Table(name = "comment")
public class Comment extends BaseEntity {

    @Column(name = "post_slug", nullable = false)
    private String postSlug;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(columnDefinition = "text", nullable = false)
    private String body;

    public String getPostSlug() { return postSlug; }
    public void setPostSlug(String postSlug) { this.postSlug = postSlug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
}
