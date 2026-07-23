package net.reformedwitness.cog.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import net.thebennett.platform.data.BaseEntity;

@Entity
@Table(name = "subscription")
public class Subscription extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
