package net.reformedwitness.cog.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import net.reformedwitness.cog.domain.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    boolean existsByEmail(String email);
}
