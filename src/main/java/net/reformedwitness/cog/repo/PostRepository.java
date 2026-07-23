package net.reformedwitness.cog.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import net.reformedwitness.cog.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByPublishedTrueOrderByPublishedOnDescIdDesc();

    List<Post> findByPublishedTrueAndAuthorOrderByPublishedOnDescIdDesc(String author);

    Optional<Post> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query("select distinct p from Post p join p.tags t "
            + "where p.published = true and t = :tag order by p.publishedOn desc, p.id desc")
    List<Post> findPublishedByTag(@Param("tag") String tag);

    /** [tag, count] for every tag used by a published post. */
    @Query("select t, count(p) from Post p join p.tags t where p.published = true group by t order by t")
    List<Object[]> tagCounts();
}
