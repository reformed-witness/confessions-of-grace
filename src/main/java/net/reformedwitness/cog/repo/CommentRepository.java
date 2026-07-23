package net.reformedwitness.cog.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import net.reformedwitness.cog.domain.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostSlugOrderByCreatedAtAsc(String postSlug);

    long countByPostSlug(String postSlug);
}
