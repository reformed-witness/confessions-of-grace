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

    /** Admin listing — includes unpublished drafts. */
    List<Post> findAllByOrderByPublishedOnDescIdDesc();

    Optional<Post> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query("select distinct p from Post p join p.tags t "
            + "where p.published = true and t = :tag order by p.publishedOn desc, p.id desc")
    List<Post> findPublishedByTag(@Param("tag") String tag);

    /** [tag, count] for every tag used by a published post. */
    @Query("select t, count(p) from Post p join p.tags t where p.published = true group by t order by t")
    List<Object[]> tagCounts();

    /**
     * Full-text-ish search across everything a reader would expect to match — including the post BODY,
     * which the old browser-side search could not reach because it only ever had the summaries.
     *
     * <p>{@code distinct} because the tag join multiplies rows for a post matching on several tags.
     */
    @Query("select distinct p from Post p left join p.tags t where p.published = true and ("
            + "lower(p.title) like :q escape '#' or lower(p.excerpt) like :q escape '#' "
            + "or lower(p.author) like :q escape '#' or lower(p.content) like :q escape '#' "
            + "or lower(t) like :q escape '#') "
            + "order by p.publishedOn desc, p.id desc")
    List<Post> search(@Param("q") String lowercaseLikePattern);

    List<Post> findByPublishedTrueOrderByPublishedOnDescIdDesc(org.springframework.data.domain.Limit limit);
}
