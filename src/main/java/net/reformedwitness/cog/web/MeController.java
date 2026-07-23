package net.reformedwitness.cog.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Public: lets the SPA discover whether the visitor is a logged-in admin. */
@RestController
@RequestMapping("/api/me")
public class MeController {

    private final CurrentUser current;

    public MeController(CurrentUser current) {
        this.current = current;
    }

    @GetMapping
    public Dto.MeInfo me() {
        boolean authed = current.isAuthenticated();
        return new Dto.MeInfo(authed, authed, current.owner());
    }
}
