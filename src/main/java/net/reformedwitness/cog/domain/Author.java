package net.reformedwitness.cog.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import net.thebennett.platform.data.BaseEntity;

@Entity
@Table(name = "author")
public class Author extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "text")
    private String bio = "";

    @Column(name = "x_link")
    private String xLink;
    @Column(name = "fb_link")
    private String fbLink;
    @Column(name = "insta_link")
    private String instaLink;
    @Column(name = "pfp_link")
    private String pfpLink;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getXLink() { return xLink; }
    public void setXLink(String xLink) { this.xLink = xLink; }
    public String getFbLink() { return fbLink; }
    public void setFbLink(String fbLink) { this.fbLink = fbLink; }
    public String getInstaLink() { return instaLink; }
    public void setInstaLink(String instaLink) { this.instaLink = instaLink; }
    public String getPfpLink() { return pfpLink; }
    public void setPfpLink(String pfpLink) { this.pfpLink = pfpLink; }
}
