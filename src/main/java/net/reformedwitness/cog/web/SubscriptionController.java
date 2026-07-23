package net.reformedwitness.cog.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import net.reformedwitness.cog.domain.Subscription;
import net.reformedwitness.cog.repo.SubscriptionRepository;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionRepository subscriptions;

    public SubscriptionController(SubscriptionRepository subscriptions) {
        this.subscriptions = subscriptions;
    }

    @PostMapping
    public ResponseEntity<Void> subscribe(@RequestBody Dto.SubscribeRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email required");
        }
        String email = req.email().trim().toLowerCase();
        if (!subscriptions.existsByEmail(email)) {
            Subscription s = new Subscription();
            s.setEmail(email);
            subscriptions.save(s);
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
