package net.reformedwitness.cog.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import net.reformedwitness.cog.domain.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    boolean existsByEmail(String email);

    List<Subscription> findAllByOrderByCreatedAtDesc();
}
